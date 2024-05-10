const createTakeAndSkip = (page) => {
  const take = 20;
  const skip = (page - 1) * take;

  return { take, skip };
};

const formatePagedData = (data, totalData, page, take) => {
  return {
    data: data,
    paging: {
      totalData: totalData,
      page: page,
      totalPage: Math.ceil(totalData / take),
    },
  };
};

export const pagingHelper = {
  createTakeAndSkip,
  formatePagedData,
};
