import type { Card } from '@/components/project-management/cards/types';
import { useCardsService } from '@/services/useCardsService';
import { useSnackbarStore } from '@/stores/snackbar';
import type { Field } from '@tillywork/shared';
import { cloneDeep } from 'lodash';

export const useCard = () => {
  const { showSnackbar } = useSnackbarStore();
  const { useUpdateCardMutation } = useCardsService();
  const { mutateAsync: updateCard } = useUpdateCardMutation();

  function updateFieldValue({
    card,
    field,
    v,
  }: {
    card: Card;
    field: Field;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    v: any;
  }) {
    const newValue = Array.isArray(v)
      ? v.map((item) => (item.item ? item.item : item.toString()))
      : [v.item ? v.item : v.toString()];
    console.log('newValue', newValue);
    const cardCopy = cloneDeep(card);
    cardCopy.data[field.slug] = Array.isArray(newValue)
      ? newValue.length && !!newValue[0]
        ? newValue
        : undefined
      : newValue;

    updateCard(cardCopy).catch(() => {
      showSnackbar({
        message: 'Something went wrong, please try again.',
        color: 'error',
      });
    });
  }

  return {
    updateFieldValue,
  };
};
