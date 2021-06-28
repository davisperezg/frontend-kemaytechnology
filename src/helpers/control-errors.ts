export const findError = (error: any) => {
  for (let index = 0; index < error.graphQLErrors.length; index++) {
    const element =
      error.graphQLErrors[index].extensions.exception.response.message;
    for (let index1 = 0; index1 < element.length; index1++) {
      const element1 = element[index1];
      return element1;
    }
  }
};
