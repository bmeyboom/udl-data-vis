export function atob(string) {
  return Buffer.from(string).toString('base64');
}
export function btoa(base64) {
  return Buffer.from(base64, 'base64').toString('ascii');
}
//# sourceMappingURL=btoa.node.js.map