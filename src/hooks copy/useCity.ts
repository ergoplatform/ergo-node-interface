import { useStore } from 'stores/store';
import { useDidMount } from './useDidmount';

export const useCity = () => {
  const { currentCity, initCurrentCity } = useStore().cityStore;

  useDidMount(() => {
    if (currentCity) {
      return;
    }

    initCurrentCity();
  });
};
