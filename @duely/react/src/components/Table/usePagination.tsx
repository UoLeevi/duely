import { useEffect, useMemo, useRef, useState } from 'react';
import { produce } from 'immer';
import { ElementType, hasProperty } from '@duely/util';

export const itemsPerPageOptions = [5, 10, 50, 100, 0] as const;
const defaultItemsPerPage = 10;

export function isCursorPagination<
  TItem extends Record<TKeyField, string>,
  TKeyField extends keyof TItem
>(
  pagination: UsePaginationReturn<TItem, TKeyField> | UsePaginationReturn2<TItem, TKeyField>
): pagination is UsePaginationReturn2<TItem, TKeyField> {
  return hasProperty(pagination, 'loadMore');
}

export type UsePaginationReturn<
  TItem extends Record<TKeyField, string>,
  TKeyField extends keyof TItem
> = {
  itemsPerPage: ElementType<typeof itemsPerPageOptions>;
  pageNumber: number;
  firstIndex: number;
  lastIndex: number;
  lastPageNumber: number;
  loading: boolean;
  loadingInitial: boolean;
  error: any;
  loadingTotalNumberOfItems: boolean;
  totalNumberOfItems: number;
  items: TItem[];
  nextPage(): void;
  previousPage(): void;
  setPage(pageNumber: number): void;
  setItemsPerPage(itemsPerPage: number): void;
};

export function usePagination<
  TItem extends Record<TKeyField, string>,
  TKeyField extends keyof TItem
>(options: {
  getTotalNumberOfItems: () => { count: number; loading: boolean; error: any };
  getPageItems: (state: {
    itemsPerPage: ElementType<typeof itemsPerPageOptions>;
    pageNumber: number;
    firstIndex: number;
    lastIndex: number;
  }) => { items: TItem[]; loading: boolean; error: any };
  itemsPerPage?: ElementType<typeof itemsPerPageOptions>;
  pageNumber?: number;
}): UsePaginationReturn<TItem, TKeyField> {
  const {
    count: totalNumberOfItems,
    loading: loadingTotalNumberOfItems,
    error: errorTotalNumberOfItems
  } = options.getTotalNumberOfItems();

  const initializedRef = useRef(false);

  const initialItemsPerPage = options.itemsPerPage ?? defaultItemsPerPage;
  const initialLastPageNumber = Math.max(
    1,
    Math.floor((totalNumberOfItems - 1) / initialItemsPerPage) + 1
  );
  const initialPageNumber = Math.min(initialLastPageNumber, Math.max(1, options.pageNumber ?? 1));

  const [state, setState] = useState({
    itemsPerPage: initialItemsPerPage,
    pageNumber: initialPageNumber,
    firstIndex:
      initialItemsPerPage === 0
        ? 0
        : Math.min(totalNumberOfItems, (initialPageNumber - 1) * initialItemsPerPage),
    lastIndex:
      initialItemsPerPage === 0
        ? totalNumberOfItems - 1
        : Math.min(totalNumberOfItems - 1, initialPageNumber * initialItemsPerPage - 1),
    lastPageNumber: initialLastPageNumber
  });

  const { items, loading, error } = options.getPageItems(state);
  initializedRef.current ||= !loading;

  useEffect(() => {
    setState((state) => ({
      itemsPerPage: initialItemsPerPage,
      pageNumber: state.pageNumber,
      firstIndex:
        state.itemsPerPage === 0
          ? 0
          : Math.min(totalNumberOfItems, (state.pageNumber - 1) * state.itemsPerPage),
      lastIndex:
        initialItemsPerPage === 0
          ? totalNumberOfItems - 1
          : Math.min(totalNumberOfItems - 1, state.pageNumber * state.itemsPerPage - 1),
      lastPageNumber: Math.max(1, Math.floor((totalNumberOfItems - 1) / state.itemsPerPage) + 1)
    }));
  }, [totalNumberOfItems]);

  const functions = useMemo(
    () => ({
      nextPage() {
        setState((state) =>
          produce(state, (state) => {
            if (state.itemsPerPage === 0) return;
            if (state.pageNumber * state.itemsPerPage >= totalNumberOfItems) return;
            state.pageNumber += 1;
            state.firstIndex += state.itemsPerPage;
            state.lastIndex = Math.min(
              state.firstIndex + state.itemsPerPage - 1,
              totalNumberOfItems - 1
            );
          })
        );
      },
      previousPage() {
        setState((state) =>
          produce(state, (state) => {
            if (state.itemsPerPage === 0) return;
            if (state.pageNumber === 1) return;
            state.pageNumber -= 1;
            state.firstIndex -= state.itemsPerPage;
            state.lastIndex = Math.min(
              state.firstIndex + state.itemsPerPage - 1,
              totalNumberOfItems - 1
            );
          })
        );
      },
      setPage(pageNumber: number) {
        setState((state) =>
          produce(state, (state) => {
            if (state.itemsPerPage === 0) return;
            if ((pageNumber - 1) * state.itemsPerPage >= totalNumberOfItems) return;
            state.pageNumber = pageNumber;
            state.firstIndex = Math.min(
              (pageNumber - 1) * state.itemsPerPage,
              totalNumberOfItems - 1
            );
            state.lastIndex = Math.min(
              state.firstIndex + state.itemsPerPage - 1,
              totalNumberOfItems - 1
            );
          })
        );
      },
      setItemsPerPage(itemsPerPage: ElementType<typeof itemsPerPageOptions>) {
        setState((state) =>
          produce(state, (state) => {
            if (isNaN(itemsPerPage) || itemsPerPage < 0) itemsPerPage = 0;
            state.itemsPerPage = itemsPerPage;

            if (state.itemsPerPage === 0) {
              state.firstIndex = 0;
              state.lastIndex = totalNumberOfItems - 1;
              state.pageNumber = 1;
              return;
            }

            state.lastIndex = Math.min(
              state.firstIndex + state.itemsPerPage - 1,
              totalNumberOfItems - 1
            );

            state.pageNumber = Math.floor(state.firstIndex / state.itemsPerPage) + 1;
            state.lastPageNumber = Math.max(
              1,
              Math.floor((totalNumberOfItems - 1) / state.itemsPerPage) + 1
            );
          })
        );
      }
    }),
    [totalNumberOfItems]
  );

  return {
    ...state,
    ...functions,
    loadingInitial: initializedRef.current,
    loading:
      loading || loadingTotalNumberOfItems || state.lastIndex - state.firstIndex + 1 > items.length,
    error: error || errorTotalNumberOfItems,
    loadingTotalNumberOfItems,
    totalNumberOfItems,
    items
  };
}

export type UsePaginationReturn2<
  TItem extends Record<TKeyField, string>,
  TKeyField extends keyof TItem
> = {
  loading: boolean;
  loadingInitial: boolean;
  error: any;
  items: TItem[];
  loadMore(): void;
  itemsPerPage: ElementType<typeof itemsPerPageOptions>;
};

export function usePagination2<
  TItem extends Record<TKeyField, string>,
  TKeyField extends keyof TItem
>(options: {
  keyField: TKeyField | ((item: TItem) => string);
  getItems: (state: {
    limit: ElementType<typeof itemsPerPageOptions>;
    starting_after?: string;
  }) => { items: TItem[]; loading: boolean; error: any };
  itemsPerPage?: ElementType<typeof itemsPerPageOptions>;
}): UsePaginationReturn2<TItem, TKeyField> {
  const [pages] = useState<TItem[][]>([]);

  const getKey =
    typeof options.keyField === 'function'
      ? options.keyField
      : (item?: TItem) => item?.[options.keyField as keyof TItem] as string;

  const initialItemsPerPage = options.itemsPerPage ?? defaultItemsPerPage;

  const [state, setState] = useState<Parameters<typeof options.getItems>[0]>({
    limit: initialItemsPerPage,
    starting_after: undefined
  });

  let { items: currentPage, loading, error } = options.getItems(state);

  const lastPage = pages[pages.length - 1];
  const lastItem = lastPage && lastPage[lastPage.length - 1];
  const currentPageLastItem = currentPage && currentPage[currentPage.length - 1];

  if (currentPageLastItem && getKey(currentPageLastItem) !== getKey(lastItem)) {
    pages.push(currentPage);
  }

  const functions = useMemo(
    () => ({
      loadMore() {
        setState((state) =>
          produce(state, (state) => {
            if (state.limit === 0) return;
            const lastPage = pages[pages.length - 1];
            const lastItem = lastPage && lastPage[lastPage.length - 1];
            state.starting_after = getKey(lastItem as any);
          })
        );
      }
    }),
    []
  );

  const items = useMemo(() => pages.flatMap((x) => x), [getKey(currentPageLastItem)]);

  return {
    itemsPerPage: state.limit,
    ...functions,
    loadingInitial: loading && pages.length === 0,
    loading,
    error,
    items
  };
}
