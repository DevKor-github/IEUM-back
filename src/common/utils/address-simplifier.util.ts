export function addressSimplifier(address: string): string {
  const addressArray = address.split(' ');
  const simplifiedAddressParts = addressArray.slice(0, 2);
  return simplifiedAddressParts.join(' ');
}
