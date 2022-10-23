import { differenceInDays, format } from "date-fns";
import { useMemo } from "react";
import { Line, Pie } from "react-chartjs-2";
import { useGetRenews } from "../hooks/renew/useGetRenew";
import { useGetVehicles } from "../hooks/vehicle/useGetVehicle";
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

      const allUearNow = formatedYearData.some((a: any) => a === getYearNow);

      if (allUearNow) {
        const resultMonths = formatedMonthData.reduce(
          (prev, cur) => ((prev[cur] = prev[cur] + 1 || 1), prev),
          {}
        );
        console.log(resultMonths);
        return {
          size: formatedYearData.filter((a: any) => a === getYearNow).length,
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
      formatedYearData = dataRenews.map((a: any) =>
        format(new Date(String(a.createdAt)), "yyyy")
      );

      formatedMonthData = dataRenews.map((a: any) =>
        format(new Date(String(a.createdAt)), "MMMM")
      );

      const allUearNow = formatedYearData.some((a: any) => a === getYearNow);

      if (allUearNow) {
        const resultMonths = formatedMonthData.reduce(
          (prev, cur) => ((prev[cur] = prev[cur] + 1 || 1), prev),
          {}
        );

        return {
          size: formatedYearData.filter((a: any) => a === getYearNow).length,
          keys: Object.keys(resultMonths),
          values: Object.values(resultMonths),
        };
      }
    }

    return {};
  }, [dataRenews, getYearNow]);

  console.log("memoVehiclesInsts", memoVehiclesInsts || []);
  console.log(
    "datavehicles-YY",
    dataVechiles?.map(
      (a: any) => format(new Date(String(a.createdAt)), "yyyy") || []
    )
  );
  console.log(
    "datavehicles-MM",
    dataVechiles?.map(
      (a: any) => format(new Date(String(a.createdAt)), "MMMM") || []
    )
  );

  console.log("memoVehiclesRenews", memoVehiclesInsts || []);
  console.log(
    "dataRenews-YY",
    dataRenews?.map(
      (a: any) => format(new Date(String(a.createdAt)), "yyyy") || []
    )
  );
  console.log(
    "dataRenews-MM",
    dataRenews?.map(
      (a: any) => format(new Date(String(a.createdAt)), "MMMM") || []
    )
  );

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
        }) x meses - ${getYearNow}`,
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
        }) x meses - ${getYearNow}`,
      },
    },
  };

  const normalidadGen =
    ((memoVehicles?.sizeDefead || 0) * 100) / (memoVehicles?.size || 0);

  const normalidadYear =
    ((memoVehicles22?.sizeDefead || 0) * 100) / (memoVehicles22?.size || 0);

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
        <div style={{ width: "20%", textAlign: "center" }}>
          <strong>Normalidad - {getYearNow}</strong>
          <h2 style={{ margin: "13px 0 13px 0px" }}>{normalidadYear}%</h2>
          <h1 style={{ marginTop: "30px", fontSize: 55 }}>
            {normalidadYear < 50
              ? "😢"
              : normalidadYear > 50 && normalidadYear < 60
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
    </>
  );
};

export default Dashboard;
