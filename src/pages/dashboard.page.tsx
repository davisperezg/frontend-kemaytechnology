import { differenceInDays, format } from "date-fns";
import { useCallback, useMemo } from "react";
import { Line, Pie } from "react-chartjs-2";
import { useGetBilling } from "../hooks/billing/useGetBilling";
import { useGetRenews } from "../hooks/renew/useGetRenew";
import { useGetVehicles } from "../hooks/vehicle/useGetVehicle";
import { Billing } from "../interfaces/billing.interface";
import { Vehicle } from "../interfaces/vehicle.interface";

const Dashboard = () => {
  const {
    data: dataVechiles,
    isLoading,
    isError,
    isFetching,
    error,
  } = useGetVehicles();

  const {
    data: dataRenews,
    isLoading: isLoadingRenew,
    isError: isErrorRenew,
    isFetching: isFetchingRenew,
    error: errorRenew,
  } = useGetRenews();

  const {
    data: dataBilling,
    isLoading: isLoadingBilling,
    isError: isErrorBilling,
    isFetching: isFetchingBilling,
    error: errorBilling,
  } = useGetBilling();

  const getYearNow = format(new Date(), "yyyy");

  const memoVehicles = useMemo(() => {
    const colorsError = ["VENCIDO", "ACTIVO", "POR VENCER"];
    let statusVehicles: any[] = [];

    if (dataVechiles) {
      statusVehicles = dataVechiles.map((add: Vehicle) => {
        const billingEnd = new Date(String(add.billigEnd));
        const diffDays = differenceInDays(billingEnd, new Date());
        if (diffDays > 7) {
          return colorsError[1];
        } else if (diffDays <= 7 && diffDays >= 0) {
          return colorsError[2];
        } else {
          return colorsError[0];
        }
      });

      const resultStatus = statusVehicles.reduce(
        (prev, cur) => ((prev[cur] = prev[cur] + 1 || 1), prev),
        {}
      );

      return {
        size: statusVehicles.filter((a: any) => a === "ACTIVO").length,
        sizeDefead: statusVehicles.filter((a: any) => a === "VENCIDO").length,
        statusVehicles: Object.keys(resultStatus),
        cantVehicles: Object.values(resultStatus),
      };
    }

    return {};
  }, [dataVechiles]);

  const memoVehicles22 = useMemo(() => {
    const colorsError = ["VENCIDO", "ACTIVO", "POR VENCER"];
    let statusVehicles: any[] = [];

    if (dataVechiles) {
      const search22 = dataVechiles.map((a: any) => {
        return {
          ...a,
          year: format(new Date(String(a.createdAt)), "yyyy"),
        };
      });

      statusVehicles = search22
        .filter((b: any) => b.year === getYearNow)
        .map((add: Vehicle) => {
          const billingEnd = new Date(String(add.billigEnd));
          const diffDays = differenceInDays(billingEnd, new Date());
          if (diffDays > 7) {
            return colorsError[1];
          } else if (diffDays <= 7 && diffDays >= 0) {
            return colorsError[2];
          } else {
            return colorsError[0];
          }
        });

      const resultStatus = statusVehicles.reduce(
        (prev, cur) => ((prev[cur] = prev[cur] + 1 || 1), prev),
        {}
      );

      return {
        size: statusVehicles.filter((a: any) => a === "ACTIVO").length,
        sizeDefead: statusVehicles.filter((a: any) => a === "VENCIDO").length,
        statusVehicles: Object.keys(resultStatus),
        cantVehicles: Object.values(resultStatus),
      };
    }

    return {};
  }, [dataVechiles, getYearNow]);

  const memoVehiclesInsts = useMemo(() => {
    let formatedYearData: any[] = [];
    let formatedMonthData: any[] = [];

    if (dataVechiles) {
      formatedYearData = dataVechiles.map((a: any) => {
        return {
          ...a,
          year: format(new Date(String(a.createdAt)), "yyyy"),
        };
      });

      formatedMonthData = formatedYearData
        .filter((a: any) => a.year === getYearNow)
        .map((b: any) => format(new Date(String(b.createdAt)), "MMMM"));

      const allUearNow = formatedYearData.some(
        (a: any) => a.year === getYearNow
      );

      if (allUearNow) {
        const resultMonths = formatedMonthData.reduce(
          (prev, cur) => ((prev[cur] = prev[cur] + 1 || 1), prev),
          {}
        );

        return {
          size: formatedYearData.filter((a: any) => a.year === getYearNow)
            .length,
          keys: Object.keys(resultMonths),
          values: Object.values(resultMonths),
        };
      }
    }

    return {};
  }, [dataVechiles, getYearNow]);

  const memoVehiclesRenews = useMemo(() => {
    let formatedYearData: any[] = [];
    let formatedMonthData: any[] = [];

    if (dataRenews) {
      formatedYearData = dataRenews.map((a: any) => {
        return {
          ...a,
          year: format(new Date(String(a.createdAt)), "yyyy"),
        };
      });

      formatedMonthData = formatedYearData
        .filter((a: any) => a.year === getYearNow)
        .map((b: any) => format(new Date(String(b.createdAt)), "MMMM"));

      const allUearNow = formatedYearData.some(
        (a: any) => a.year === getYearNow
      );

      if (allUearNow) {
        const resultMonths = formatedMonthData.reduce(
          (prev, cur) => ((prev[cur] = prev[cur] + 1 || 1), prev),
          {}
        );

        return {
          size: formatedYearData.filter((a: any) => a.year === getYearNow)
            .length,
          keys: Object.keys(resultMonths),
          values: Object.values(resultMonths),
        };
      }
    }

    return {};
  }, [dataRenews, getYearNow]);

  const validateColorsBg = (tip: string) => {
    if (tip === "A") {
      const colors = memoVehicles?.statusVehicles?.map((a) => {
        if (a === "ACTIVO") {
          return "rgba(54, 162, 235, 0.2)";
        }

        if (a === "VENCIDO") {
          return "rgba(255, 99, 132, 0.2)";
        }

        if (a === "POR VENCER") {
          return "rgba(255, 206, 86, 0.2)";
        }
      });

      return colors;
    }

    if (tip === "B") {
      const colors = memoVehicles22?.statusVehicles?.map((a) => {
        if (a === "ACTIVO") {
          return "rgba(54, 162, 235, 0.2)";
        }

        if (a === "VENCIDO") {
          return "rgba(255, 99, 132, 0.2)";
        }

        if (a === "POR VENCER") {
          return "rgba(255, 206, 86, 0.2)";
        }
      });

      return colors;
    }
  };

  const validateColorsBorder = (tip: string) => {
    if (tip === "A") {
      const colors = memoVehicles?.statusVehicles?.map((a) => {
        if (a === "ACTIVO") {
          return "rgba(54, 162, 235, 1)";
        }

        if (a === "VENCIDO") {
          return "rgba(255, 99, 132, 1)";
        }

        if (a === "POR VENCER") {
          return "rgba(255, 206, 86, 1)";
        }
      });

      return colors;
    }

    if (tip === "B") {
      const colors = memoVehicles22?.statusVehicles?.map((a) => {
        if (a === "ACTIVO") {
          return "rgba(54, 162, 235, 1)";
        }

        if (a === "VENCIDO") {
          return "rgba(255, 99, 132, 1)";
        }

        if (a === "POR VENCER") {
          return "rgba(255, 206, 86, 1)";
        }
      });

      return colors;
    }
  };

  const data = {
    labels: memoVehicles.statusVehicles,
    datasets: [
      {
        label: "# de vehiculos",
        data: memoVehicles.cantVehicles,
        backgroundColor: validateColorsBg("A"),
        borderColor: validateColorsBorder("A"),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Estados de ${dataVechiles?.length || 0} vehiculos`,
      },
    },
  };

  const dataPie22 = {
    labels: memoVehicles22.statusVehicles,
    datasets: [
      {
        label: "# de vehiculos",
        data: memoVehicles22.cantVehicles,
        backgroundColor: validateColorsBg("B"),
        borderColor: validateColorsBorder("B"),
        borderWidth: 1,
      },
    ],
  };

  const optionsPie22 = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Estados de ${
          memoVehicles22?.size || 0
        } vehiculos - ${getYearNow}`,
      },
    },
  };

  //area
  const dataVehiclesArea = {
    labels: memoVehiclesInsts.keys,
    datasets: [
      {
        fill: true,
        label: "Instalaciones",
        data: memoVehiclesInsts.values,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const optionsVehicles = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `"Cantidad de instalaciones(${
          memoVehiclesInsts?.size || 0
        }) - ${getYearNow}`,
      },
    },
  };

  //area 2
  const dataRenewsArea = {
    labels: memoVehiclesRenews.keys,
    datasets: [
      {
        fill: true,
        label: "Renovaciones",
        data: memoVehiclesRenews.values,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const optionsRenews = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Cantidad de renovaciones(${
          memoVehiclesRenews?.size || 0
        }) - ${getYearNow}`,
      },
    },
  };

  const normalidadGen =
    ((memoVehicles?.sizeDefead || 0) * 100) / (memoVehicles?.size || 0);

  const memoVehiclesRenewsByParam = useCallback(
    (billing: string) => {
      let formatedYearData: any[] = [];
      let formatedMonthData: any[] = [];

      if (dataRenews) {
        formatedYearData = dataRenews
          .filter((x: any) => x.billing.name === billing)
          .map((a: any) => {
            return {
              ...a,
              year: format(new Date(String(a.createdAt)), "yyyy"),
            };
          });

        formatedMonthData = formatedYearData
          .filter((a: any) => a.year === getYearNow)
          .map((b: any) => format(new Date(String(b.createdAt)), "MMMM"));

        const allUearNow = formatedYearData.some(
          (a: any) => a.year === getYearNow
        );

        if (allUearNow) {
          const resultMonths = formatedMonthData.reduce(
            (prev, cur) => ((prev[cur] = prev[cur] + 1 || 1), prev),
            {}
          );

          return {
            size: formatedYearData.filter((a: any) => a.year === getYearNow)
              .length,
            keys: Object.keys(resultMonths),
            values: Object.values(resultMonths),
          };
        }
      }

      return {};
    },
    [dataRenews, getYearNow]
  );

  const memoVehiclesInstsByParam = useCallback(
    (billing: string) => {
      let formatedYearData: any[] = [];
      let formatedMonthData: any[] = [];

      if (dataVechiles) {
        formatedYearData = dataVechiles
          .filter((x: any) => x.billing.name === billing)
          .map((a: any) => {
            return {
              ...a,
              year: format(new Date(String(a.createdAt)), "yyyy"),
            };
          });

        formatedMonthData = formatedYearData
          .filter((a: any) => a.year === getYearNow)
          .map((b: any) => format(new Date(String(b.createdAt)), "MMMM"));

        const allUearNow = formatedYearData.some(
          (a: any) => a.year === getYearNow
        );

        if (allUearNow) {
          const resultMonths = formatedMonthData.reduce(
            (prev, cur) => ((prev[cur] = prev[cur] + 1 || 1), prev),
            {}
          );

          return {
            size: formatedYearData.filter((a: any) => a.year === getYearNow)
              .length,
            keys: Object.keys(resultMonths),
            values: Object.values(resultMonths),
          };
        }
      }

      return {};
    },
    [dataVechiles, getYearNow]
  );

  const LoadBillingRen = ({ billing }: any) => {
    const data = {
      labels: memoVehiclesRenewsByParam(billing.name).keys,
      datasets: [
        {
          fill: true,
          label: "Renovaciones " + billing.name,
          data: memoVehiclesRenewsByParam(billing.name).values,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top" as const,
        },
        title: {
          display: true,
          text: `"Cantidad de renovaciones en ${billing.name}(${
            memoVehiclesRenewsByParam(billing.name)?.size || 0
          }) - ${getYearNow}`,
        },
      },
    };

    return <Line options={options} data={data} />;
  };

  const LoadBillingIns = ({ billing }: any) => {
    const data = {
      labels: memoVehiclesInstsByParam(billing.name).keys,
      datasets: [
        {
          fill: true,
          label: "Instalaciones " + billing.name,
          data: memoVehiclesInstsByParam(billing.name).values,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top" as const,
        },
        title: {
          display: true,
          text: `"Cantidad de instalaciones en ${billing.name}(${
            memoVehiclesInstsByParam(billing.name)?.size || 0
          }) - ${getYearNow}`,
        },
      },
    };

    return <Line options={options} data={data} />;
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div style={{ width: "20%" }}>
          <Pie options={options} data={data} />
        </div>
        <div style={{ width: "20%" }}>
          <Pie options={optionsPie22} data={dataPie22} />
        </div>
        <div style={{ width: "20%", textAlign: "center" }}>
          <strong>Normalidad</strong>
          <h2 style={{ margin: "13px 0 13px 0px" }}>{normalidadGen}%</h2>
          <h1 style={{ marginTop: "30px", fontSize: 55 }}>
            {normalidadGen < 50
              ? "😢"
              : normalidadGen > 50 && normalidadGen < 60
              ? "😐"
              : "😃"}
          </h1>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ width: "50%" }}>
          <Line options={optionsVehicles} data={dataVehiclesArea} />
        </div>
        <div style={{ width: "50%" }}>
          <Line options={optionsRenews} data={dataRenewsArea} />
        </div>
      </div>
      <div style={{ width: "100%" }}>
        <div style={{ width: "50%", float: "left" }}>
          {dataBilling?.map((a: any, i: number) => {
            return (
              <div key={i + 1}>
                <LoadBillingIns billing={a} />
              </div>
            );
          })}
        </div>

        <div style={{ width: "50%", float: "left" }}>
          {dataBilling?.map((a: any, i: number) => {
            return (
              <div key={i + 1}>
                <LoadBillingRen billing={a} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
