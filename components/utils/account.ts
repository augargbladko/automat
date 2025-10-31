export function accountName(address: string): string {
  return `${address.slice(2, 8)}…`
}
