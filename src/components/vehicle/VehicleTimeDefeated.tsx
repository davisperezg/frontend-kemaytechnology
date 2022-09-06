import { useCallback, useEffect, useState } from "react";
import "./vehicle.css";
import VehicleTimeDefeatedMonth from "./VehicleTimeDefeatedMonth";

interface Props {
  id: number;
  entity: any;
  setTime: any;
  time: any;
  clearErrorAnClicked: () => void;
  activeYears: any[];
  setDataYearInActives: any;
}

interface MonthState {
  name: string;
  state: boolean;
}

const VehicleTimeDefeated = ({
  id,
  entity,
  setTime,
  time,
  clearErrorAnClicked,
  activeYears,
  setDataYearInActives,
}: Props) => {
  const [stateYear, setYear] = useState({
    name: entity.year.name,
    state: entity.year.state,
    index: entity.year.index,
  });

  const handleActive = () => {
    clearErrorAnClicked();
    //si activamos el anio tambien activaremos todos los meses
    if (stateYear.state === false) {
      setYear({
        ...stateYear,
        state: true,
        index: entity.months.length - 1,
      });
      const wi = activeYears.map((a) => {
        return {
          ...a,
          year: {
            ...a.year,
            index:
              a.year.name === stateYear.name
                ? entity.months.length - 1
                : a.year.index,
            state: a.year.name === stateYear.name ? true : a.year.state,
          },

          isFullActive: a.year.name === stateYear.name ? true : a.isFullActive,
          months:
            a.year.name === stateYear.name
              ? a.months.map((a: any) => ({ ...a, state: true }))
              : a.months,
        };
      });
      setDataYearInActives(wi);
    } else {
      //si desactivamos el anio tambien desactivaremos todos los meses
      setYear({
        ...stateYear,
        state: false,
        index: -1,
      });
      const wi = activeYears.map((a) => {
        return {
          ...a,
          year: {
            ...a.year,
            index:
              Number(stateYear.name) > Number(a.year.name) ? a.year.index : -1,
            state:
              Number(stateYear.name) > Number(a.year.name)
                ? a.year.state
                : false,
          },

          isFullActive:
            Number(stateYear.name) > Number(a.year.name) ? true : false,
          months:
            Number(stateYear.name) > Number(a.year.name)
              ? a.months
              : a.months.map((a: any) => ({ ...a, state: false })),
        };
      });
      setDataYearInActives(wi);
    }
  };

  useEffect(() => {
    if (entity) {
      setYear({
        name: entity.year.name,
        state: entity.year.state,
        index: entity.year.index,
      });
    }
  }, [entity, stateYear.name]);

  const isActiveOneYearPast = activeYears.find(
    (a: any) => a.year.name === String(Number(Number(stateYear.name) - 1))
  );

  return (
    <div className="ym-div">
      <div className="year">
        <label
          className={`${
            !entity.isYearPast
              ? stateYear.state
                ? "label-year label-year-selected"
                : "label-year"
              : isActiveOneYearPast.isFullActive
              ? stateYear.state
                ? "label-year label-year-selected"
                : "label-year"
              : "year_labelNot"
          }`}
          onClick={() => {
            if (!entity.isYearPast || isActiveOneYearPast.isFullActive) {
              return handleActive();
            }
          }}
        >
          {stateYear.name}
        </label>
      </div>
      <div className="cred">
        {entity.months.map((row: any, i: number) => {
          return (
            <VehicleTimeDefeatedMonth
              stateYear={stateYear}
              //setAllMonths={setAllMonths}
              setYear={setYear}
              month={row}
              elements={entity.months}
              key={i + 1}
              setTime={setTime}
              time={time}
              clearErrorAnClicked={clearErrorAnClicked}
              setDataYearInActives={setDataYearInActives}
              activeYears={activeYears}
            />
          );
        })}
        ({entity.months.length})
      </div>
    </div>
  );
};

export default VehicleTimeDefeated;
