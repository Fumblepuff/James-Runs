
export default {
  HEIGHT_ITEM: 45,
  HEIGHT_ITEM_VIEW_TWO: 35,

  getHeightContainer(
    data,
    types,
  ) {
    const { isTypeViewTwo } = types || {};
    const height = isTypeViewTwo ? this.HEIGHT_ITEM_VIEW_TWO : this.HEIGHT_ITEM;

    const res = data ? (data.length * height) + 10 : undefined;

    return res;
  },
};
