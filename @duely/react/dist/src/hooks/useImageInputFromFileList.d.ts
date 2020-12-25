import type { ImageInput } from '@duely/core';
/**
 * Use image from file or if file is not provided use image from image object.
 */
export declare function useImageInputFromFileList(fileList: FileList | null | undefined): {
    image: ImageInput | null;
    loading: boolean;
    error: Error | null;
};
