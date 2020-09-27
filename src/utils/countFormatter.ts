// Писал олимпиадник, как работает не знаю.
export const createCountFormatter = ({ few, one, two }: any) => {
  const titles = [one, two, few];

  return (number: number) => {
    const cases = [2, 0, 1, 1, 1, 2];

    return titles[
      number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]
    ];
  };
};
