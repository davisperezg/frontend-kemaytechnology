import { isBefore } from "date-fns";
import { useEffect, useState } from "react";
import "./vehicle.css";

interface Props {
  month: { name: string; state: boolean };
  elements: { name: string; state: boolean }[];
  stateYear: { name: string; state: boolean; index: number };
  setYear: React.Dispatch<
    React.SetStateAction<{
      name: any;
      state: boolean;
      index: number;
    }>
  >;
  //setAllMonths: React.Dispatch<React.SetStateAction<any[]>>;
  setTime: any;
  time: any;
  clearErrorAnClicked: () => void;
  activeYears: any;
  setDataYearInActives: any;
}

const allMonthsLocal = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const VehicleTimeDefeatedMonth = ({
  month,
  elements,
  stateYear,
  setYear,
  //setAllMonths,
  setTime,
  time,
  clearErrorAnClicked,
  setDataYearInActives,
  activeYears,
}: Props) => {
  const [selectedMonth, setSelectedMonth] = useState({
    name: month.name,
    state: month.state,
  });

  const searchPositionMonth = (month: string) =>
    allMonthsLocal.indexOf(month) + 1;

  const handleREClick = () => {
    clearErrorAnClicked();

    const findPositionMonth = searchPositionMonth(selectedMonth.name);
    const getObject = activeYears.find(
      (a: any) => a.year.name === stateYear.name
    );
    const findMonthsTrues = getObject.months.filter((a: any) => a.state);
    const findPositionMonthEnd = searchPositionMonth(
      findMonthsTrues.at(-1)!.name
    );
    const isBeforeMyMonthDisable = isBefore(
      new Date(Number(stateYear.name), findPositionMonth, 1),
      new Date(Number(stateYear.name), findPositionMonthEnd, 1)
    );

    if (isBeforeMyMonthDisable) {
      const getPosition = findMonthsTrues.findIndex(
        (a: any) => a.name === selectedMonth.name
      );

      const getTruesByPosition = findMonthsTrues.slice(0, getPosition + 1);

      const getMonthsFalses = findMonthsTrues
        .slice(getPosition + 1, elements.length)
        .map((a: any) => ({ ...a, state: false }));

      const getNameEndMonthOfTRUE = findMonthsTrues.at(-1)!.name;
      const getEndMonthOfTRUE = findMonthsTrues.findIndex(
        (a: any) => a.name === getNameEndMonthOfTRUE
      );
      const getOtherMonths = elements.slice(
        getEndMonthOfTRUE + 1,
        getObject.months.length
      );

      const unionMonths = getTruesByPosition.concat(
        getMonthsFalses.concat(getOtherMonths)
      );

      const updateTOYears = activeYears.map((a: any) => {
        return {
          ...a,
          isFullActive:
            Number(stateYear.name) < Number(a.year.name) && a.year.state
              ? false
              : stateYear.name === a.year.name
              ? false
              : a.isFullActive,
          year: {
            ...a.year,
            index:
              Number(stateYear.name) < Number(a.year.name) && a.year.state
                ? -1
                : stateYear.name === a.year.name
                ? getPosition
                : a.year.index,
            state:
              Number(stateYear.name) < Number(a.year.name) && a.year.state
                ? false
                : a.year.state,
          },
          months:
            Number(stateYear.name) < Number(a.year.name) && a.year.state
              ? a.months.map((a: any) => ({ ...a, state: false }))
              : stateYear.name === a.year.name
              ? unionMonths
              : a.months,
        };
      });

      setDataYearInActives(updateTOYears);

      return;
    }

    setSelectedMonth({
      ...selectedMonth,
      state: false,
    });

    const updateTOYears = activeYears.map((a: any) => {
      return {
        ...a,
        months:
          a.year.name === stateYear.name
            ? a.months.map((b: any) => {
                return {
                  ...b,
                  state: b.name === selectedMonth.name ? false : b.state,
                };
              })
            : a.months,
      };
    });
    setDataYearInActives(updateTOYears);

    const getYearObject = updateTOYears.find(
      (a: any) => a.year.name === stateYear.name
    );

    const searchOneFalse = getYearObject.months.every((a: any) => !a.state);

    if (!searchOneFalse) {
      const goToUpdateYear = updateTOYears.map((a: any) => {
        return {
          ...a,
          year: {
            ...a.year,
            index:
              a.year.name === stateYear.name ? a.year.index - 1 : a.year.index,
          },
          isFullActive: a.year.name === stateYear.name ? false : a.isFullActive,
        };
      });

      setDataYearInActives(goToUpdateYear);
    } else {
      const goToUpdateYear = updateTOYears.map((a: any) => {
        return {
          ...a,
          year: {
            ...a.year,
            index: a.year.name === stateYear.name ? -1 : a.year.index,
            state: a.year.name === stateYear.name ? false : a.year.state,
          },
          isFullActive: a.year.name === stateYear.name ? false : a.isFullActive,
        };
      });

      setDataYearInActives(goToUpdateYear);
    }
  };

  const handleClick = () => {
    clearErrorAnClicked();

    setSelectedMonth({
      ...selectedMonth,
      state: true,
    });

    const updateTOYears = activeYears.map((a: any) => {
      return {
        ...a,
        year: {
          ...a.year,
          index:
            a.year.name === stateYear.name ? stateYear.index + 1 : a.year.index,
          state: a.year.name === stateYear.name ? true : a.year.state,
        },
        months:
          a.year.name === stateYear.name
            ? a.months.map((b: any) => {
                return {
                  ...b,
                  state: b.name === selectedMonth.name ? true : b.state,
                };
              })
            : a.months,
      };
    });

    setDataYearInActives(updateTOYears);

    const getYearObject = updateTOYears.find(
      (a: any) => a.year.name === stateYear.name
    );
    const allTrues = getYearObject.months.every((a: any) => a.state);
    if (allTrues) {
      const goToUpdateYear = updateTOYears.map((a: any) => {
        return {
          ...a,
          isFullActive: a.year.name === stateYear.name ? true : a.isFullActive,
        };
      });

      setDataYearInActives(goToUpdateYear);
    }
  };

  useEffect(() => {
    if (month) {
      //actualiza los meses desactivados o activados desde el padre
      setSelectedMonth({
        name: month.name,
        state: month.state,
      });
    }
  }, [month]);

  return (
    <>
      <label
        className={`
         ${
           elements[
             stateYear.index + 1 >= elements.length
               ? stateYear.index
               : stateYear.index + 1
           ].name === selectedMonth.name
             ? activeYears.some(
                 (a: any) =>
                   !a.isYearPast &&
                   a.year.name === stateYear.name &&
                   month.name === selectedMonth.name
               )
               ? elements[
                   stateYear.index + 1 >= elements.length
                     ? stateYear.index
                     : stateYear.index + 1
                 ].state
                 ? "label-month-selected pointer"
                 : "label-month"
               : activeYears.some(
                   (a: any) =>
                     a.year.name === String(Number(stateYear.name) - 1) &&
                     a.isFullActive
                 )
               ? selectedMonth.state
                 ? "label-month-selected pointer"
                 : "label-month"
               : "year_labelNot" //los primeros desactivados
             : selectedMonth.state
             ? "label-month-selected pointer"
             : "year_labelNot" //el resto de los primeros desactivaods
         }`}
        onClick={() => {
          const initMonthInYear = activeYears.find(
            (a: any) => a.year.name === stateYear.name
          );

          const nextMonth =
            elements[
              stateYear.index + 1 === elements.length
                ? stateYear.index
                : stateYear.index + 1
            ].name === selectedMonth.name;

          const isActiveFullMonthPast = activeYears.find(
            (a: any) =>
              a.year.name === String(Number(Number(stateYear.name) - 1))
          );

          if (
            (!initMonthInYear.isYearPast &&
              nextMonth &&
              !selectedMonth.state) ||
            (typeof isActiveFullMonthPast !== "undefined" &&
              isActiveFullMonthPast.isFullActive &&
              nextMonth &&
              !selectedMonth.state)
          ) {
            return handleClick();
          }

          if (selectedMonth.state) {
            return handleREClick();
          }
        }}
      >
        {month.name}
      </label>
      {elements.map((a) => a.name).at(-1) === month.name ? "" : ", "}
    </>
  );
};

export default VehicleTimeDefeatedMonth;
