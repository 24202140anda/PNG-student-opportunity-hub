export const today = () => new Date().toISOString().slice(0, 10);

export function daysLeft(deadline: string) {
  const end = new Date(deadline + "T23:59:59");
  return Math.ceil((end.getTime() - Date.now()) / 86400000);
}

export const isValidDate = (s: string) =>
  /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(s) && !isNaN(new Date(s).getTime());
