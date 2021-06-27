function formatFileSize(size: number) {
  if (size < 1000) return `${size.toFixed(0)}B`;

  size /= 1000;
  if (size < 1000) return `${size.toPrecision(3)}KB`;

  size /= 1000;
  if (size < 1000) return `${size.toPrecision(3)}MB`;

  size /= 1000;
  if (size < 1000) return `${size.toPrecision(3)}GB`;
}

export namespace ValidationRules {
  export function maxFileSize(bytes: number) {
    return (fileList: FileList) =>
      fileList?.[0]?.size > bytes ? `Maximum image size is ${formatFileSize(bytes)}.` : undefined;
  }

  export function isNumber(value: string) {
    return isNaN(+value) ? 'Value is not a valid number' : undefined;
  }

  export function isPositiveNumber(value: string) {
    return isNaN(+value) || +value < 0 ? 'Value is not a positive number' : undefined;
  }
}
