import { useStore } from 'stores/store';
import { Cities } from 'api/ssgOrSsr/fetchCities';
import { useDidMount } from './useDidmount';

export const useCities = (initCities?: Cities) => {
  const { updateCities, cities } = useStore().cityStore;

  useDidMount(() => {
    if (!initCities || initCities.length === 0) {
      return;
    }

    if (cities.length !== 0) {
      return;
    }

    updateCities(initCities);
  });
};
