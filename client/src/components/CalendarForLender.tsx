/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  endDate,
  isSelectStart,
  selectDate,
  showCalendar,
  startDate,
  unableDate,
} from '../Atom';
import {
  flexBetween,
  rem,
  color,
  shadow,
  relative,
  absolute,
  flexVertical,
} from '../common';

const calendarContainerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${color.border};
  border-radius: ${rem(5)};
  background-color: #ffffff;
  padding: ${rem(16)} 0;
  position: absolute;
  z-index: 999;
  top: -270px;
  left: -380px;
  box-shadow: ${shadow};
`;

const arrow = css`
  width: ${rem(40)};
  height: ${rem(30)};
  line-height: ${rem(1)};
  font-size: ${rem(20)};
  border: 1px solid ${color.border};
  border-radius: ${rem(5)};
  background-color: ${color.white};
  color: ${color.placeholder};
  :hover {
    opacity: 0.65;
    cursor: pointer;
  }
  :active {
    opacity: 0.95;
  }
`;
const thisMonth = css`
  font-size: ${rem(20)};
  font-weight: 700;
`;

const datesStyle = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  border: 1px solid ${color.border};
  border-radius: ${rem(5)};
`;

const reset = css`
  width: ${rem(80)};
  height: ${rem(30)};
  line-height: ${rem(30)};
  border: 1px solid ${color.point};
  color: ${color.point};
  border-radius: ${rem(5)};
  text-align: center;
  font-size: ${rem(14)};
  margin-top: ${rem(20)};
  :hover {
    font-weight: 700;
    cursor: pointer;
  }
  :active {
    opacity: 0.65;
  }
`;

const pointer = css`
  :hover {
    cursor: pointer;
  }
`;

export const unableStyle = css`
  text-align: center;
  width: ${rem(40)};
  height: ${rem(12)};
  border-radius: ${rem(5)};
  line-height: ${rem(14)};
  top: ${rem(30)};
  font-size: ${rem(10)};
  background-color: ${color.border};
  color: ${color.white};
`;
const rentalStartStyle = css`
  text-align: center;
  width: ${rem(40)};
  height: ${rem(12)};
  border-radius: ${rem(5)};
  line-height: ${rem(14)};
  top: ${rem(30)};
  font-size: ${rem(10)};
  background-color: ${color.point};
  color: ${color.white};
`;
const rentalEndStyle = css`
  text-align: center;
  width: ${rem(40)};
  height: ${rem(12)};
  border-radius: ${rem(5)};
  line-height: ${rem(14)};
  top: ${rem(30)};
  font-size: ${rem(10)};
  background-color: ${color.deep};
  color: ${color.white};
`;

const alignCenter = css`
  width: 100%;
  display: flex;
  justify-content: center;
`;

interface AdayProps {
  day: string;
  idx: number;
  width: number;
  height: number;
}

function Aday(props: AdayProps) {
  const { day, width } = props;
  return (
    <div
      css={css`
        width: ${rem(width / 7)};
        height: ${rem(width / 8)};
        font-size: ${rem(14)};
        text-align: center;
        line-height: ${rem(width / 7)};
      `}
    >
      <div>{day}</div>
    </div>
  );
}

interface AdateProps {
  date: number;
  idx: number;
  width: number;
  height: number;
  year: number;
  month: number;
  thisColor: string | null;
}

function Adate(props: AdateProps) {
  const { date, idx, width, year, month, thisColor } = props;
  const [totalRentalDates, setTotalRentalDates] = useRecoilState(selectDate);
  const [isSelectStartState, setIsSelectStartState] =
    useRecoilState(isSelectStart);
  const [start, setStart] = useRecoilState(startDate);
  const [end, setEnd] = useRecoilState(endDate);
  const unableDates = useRecoilValue(unableDate);
  let thisYear = String(year);
  let thisMonth = String(month);
  let thisDate = String(date);
  let isWeekend = 'black';

  if (idx < 6 && date - 10 > 0) {
    const preMonth = new Date(year, month - 1, 0);
    thisYear = String(preMonth.getFullYear());
    thisMonth = String(preMonth.getMonth() + 1);
  }

  if (idx > 20 && 10 - date > 0) {
    const preMonth = new Date(year, month + 1, 0);
    thisYear = String(preMonth.getFullYear());
    thisMonth = String(preMonth.getMonth() + 1);
  }

  thisMonth = thisMonth.length === 1 ? 0 + thisMonth : thisMonth;
  thisDate = thisDate.length === 1 ? 0 + thisDate : thisDate;

  const isUnable = unableDates.indexOf(`${thisYear}.${thisMonth}.${thisDate}`);

  const today = `${thisYear}.${thisMonth}.${thisDate}`;
  const selectDateHandler = () => {
    const unableSelectEnd = unableDates.find((el) => el > start);
    const unableSelectEnd2 = unableDates.find((el) => el > today);
    if (isUnable === -1) {
      if (isSelectStartState) {
        if (today >= end) {
          setEnd('');
        }
        if (unableSelectEnd2) {
          if (end > unableSelectEnd2) {
            setEnd('');
          }
        }
        setStart(today);
        //end가 이미 있고, today end보다 작으면 대여 배열생성
        if (end && today < end) {
          let newDates = totalRentalDatesGenerator(today, end);
          setTotalRentalDates(newDates);
        }
        setIsSelectStartState(false);
      } else if (today > start) {
        if (!unableSelectEnd) {
          setEnd(today);
          let newDates = totalRentalDatesGenerator(start, today);
          setTotalRentalDates(newDates);
        } else {
          if (today < unableSelectEnd) {
            setEnd(today);
            let newDates = totalRentalDatesGenerator(start, today);
            setTotalRentalDates(newDates);
          }
        }
        //대여 배열생성
      }
    }
  };

  const totalRentalDatesGenerator = (start: string, end: string): string[] => {
    let totalRentalDatesArray: string[] = [];
    const divStart = start.split('.');
    const syear = Number(divStart[0]);
    const smonth = Number(divStart[1]);
    const sdate = Number(divStart[2]);

    const divEnd = end.split('.');
    const eyear = Number(divEnd[0]);
    const emonth = Number(divEnd[1]);
    const edate = Number(divEnd[2]);

    totalRentalDatesArray = [...totalRentalDatesArray];

    if (syear === eyear && smonth === emonth) {
      let date = sdate;
      while (date <= edate) {
        totalRentalDatesArray = [
          ...totalRentalDatesArray,
          `${syear}.${smonth < 10 ? 0 : ''}${smonth}.${
            date < 10 ? 0 : ''
          }${date}`,
        ];
        date++;
      }
      return totalRentalDatesArray;
    }

    let date = sdate;
    let startMonthEedDate = new Date(syear, smonth, 0).getDate();

    while (date <= startMonthEedDate) {
      totalRentalDatesArray = [
        ...totalRentalDatesArray,
        `${syear}.${smonth < 10 ? 0 : ''}${smonth}.${
          date < 10 ? 0 : ''
        }${date}`,
      ];
      date++;
    }

    if (syear === eyear) {
      for (let i = smonth + 1; i < emonth; i++) {
        date = 1;
        startMonthEedDate = new Date(syear, i, 0).getDate();

        while (date <= startMonthEedDate) {
          totalRentalDatesArray = [
            ...totalRentalDatesArray,
            `${syear}.${i < 10 ? 0 : ''}${i}.${date < 10 ? 0 : ''}${date}`,
          ];
          date++;
        }
      }
    } else {
      for (let j = syear; j <= eyear; j++) {
        for (
          let i = j === syear ? smonth + 1 : 1;
          j === eyear ? i < emonth : i < 12;
          i++
        ) {
          date = 1;
          startMonthEedDate = new Date(j, i, 0).getDate();

          while (date <= startMonthEedDate) {
            totalRentalDatesArray = [
              ...totalRentalDatesArray,
              `${j}.${i < 10 ? 0 : ''}${i}.${date < 10 ? 0 : ''}${date}`,
            ];
            date++;
          }
        }
      }
    }

    date = 1;
    while (date <= edate) {
      totalRentalDatesArray = [
        ...totalRentalDatesArray,
        `${eyear}.${emonth < 10 ? 0 : ''}${emonth}.${
          date < 10 ? 0 : ''
        }${date}`,
      ];
      date++;
    }

    return totalRentalDatesArray;
  };

  return (
    <div
      css={[
        flexVertical,
        css`
          width: ${rem((width - 2) / 7)};
          height: ${rem(width / 7)};
          line-height: ${rem(width / 7)};
          font-size: ${rem(14)};
          text-align: center;
          border-radius: ${rem(10)};
          color: ${thisColor
            ? thisColor
            : isUnable > -1
            ? color.placeholder
            : isWeekend};
        `,
        relative,
      ]}
      onClick={selectDateHandler}
    >
      {isUnable === -1 ? (
        <>
          <div css={[pointer]}>{date}</div>
          {start === today ? (
            <div css={[absolute, rentalStartStyle]}>대여일</div>
          ) : end === today ? (
            <div css={[absolute, rentalEndStyle]}>반납일</div>
          ) : null}
        </>
      ) : (
        <>
          <div css={[isUnable === -1 ? pointer : null]}>{date}</div>
          <div css={[absolute, unableStyle]}>예약불가</div>
        </>
      )}
    </div>
  );
}

export default function Calendar() {
  const days: string[] = ['일', '월', '화', '수', '목', '금', '토'];
  const setIsShowCalendar = useSetRecoilState(showCalendar);

  //tagret 오늘기준
  const [getDate, setGetDate] = useState(new Date());
  const targetYear: number = getDate.getFullYear();
  const targetMonth: number = getDate.getMonth() + 1;

  function setGetDateHandler(year: number, month: number): void {
    setGetDate(new Date(year, month, 0));
  }

  //! start; calendar days array generator //
  const preLastInfo: Date = new Date(targetYear, targetMonth - 1, 0);
  const thisLastInfo: Date = new Date(targetYear, targetMonth, 0);

  const preLastDate = preLastInfo.getDate();
  const preLastDay = preLastInfo.getDay();
  const thisLastDate = thisLastInfo.getDate();
  const thisLastDay = thisLastInfo.getDay();

  const preDates: number[] = [];
  const thisDates: number[] = [];
  const nextDates: number[] = [];

  if (preLastDay < 6) {
    for (let i = preLastDate; i > preLastDate - preLastDay - 1; i--) {
      preDates.unshift(i);
    }
  }

  for (let i = 1; i <= thisLastDate; i++) {
    thisDates.push(i);
  }
  for (let i = 1; i < 7 - thisLastDay; i++) {
    nextDates.push(i);
  }

  const dates: number[] = [...preDates, ...thisDates, ...nextDates];

  //! end; calendar days array generator //

  const widthPixel: number = 312;
  const heigthPixel: number = 403;

  const confirmHandler = () => {
    setIsShowCalendar(false);
  };
  return (
    <div
      css={[
        calendarContainerStyle,
        css`
          width: ${rem(widthPixel + 32)};
          /* height: ${rem(heigthPixel + 32)}; */
        `,
      ]}
    >
      <div
        css={css`
          width: ${rem(widthPixel)};
          /* height: ${rem(heigthPixel)};  */
        `}
      >
        <div className="nav" css={flexBetween}>
          <button
            css={arrow}
            onClick={() => setGetDateHandler(targetYear, targetMonth - 1)}
          >
            &lt;
          </button>
          <span css={thisMonth}>{`${targetYear}년 ${targetMonth}월`}</span>
          <button
            css={arrow}
            onClick={() => setGetDateHandler(targetYear, targetMonth + 1)}
          >
            &gt;
          </button>
        </div>
        <div className="days" css={flexBetween}>
          {days.map((day, idx) => (
            <Aday
              key={idx}
              day={day}
              idx={idx}
              width={widthPixel}
              height={heigthPixel}
            />
          ))}
        </div>
        <div className="dates" css={datesStyle}>
          {dates.map((date, idx) => (
            <Adate
              key={idx}
              date={date}
              idx={idx}
              year={targetYear}
              month={targetMonth}
              width={widthPixel}
              height={heigthPixel}
              thisColor={
                (idx < 6 && date > 20) || (idx > 20 && date < 8)
                  ? color.placeholder
                  : null
              }
            />
          ))}
        </div>
        <div css={alignCenter}>
          <div className="reset" css={reset} onClick={confirmHandler}>
            확인
          </div>
        </div>
      </div>
    </div>
  );
}
