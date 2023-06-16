import { Row, Typography } from "antd";
import { memo, useState, useEffect } from "react";

import config from "../config";
import { formatOrders } from "../utils";
import OverdueSalesTable from "./OverdueSalesTable";
import { Totals, Record } from "../types/types";

const OverdueSales = ({ style }: any) => {
  const [orders, setOrders] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totals, setTotals] = useState<Totals>({
    sub_total: 0,
    tax_total: 0,
    total: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const resp = await fetch(`${config.apiUrl}/sales`, {
          method: "GET",
        });

        const body = await resp.json();

        if (!body?.orders?.length) {
          return setIsLoading(false);
        }

        const formattedOrders = formatOrders(body.orders);
        setOrders(formattedOrders);

        const subTotal = formattedOrders
          .map((each: Record) => Number(each.orderValue) * Number(each.items))
          .reduce((prev: number, next: number) => prev + next)
          .toFixed(2);

        const total = formattedOrders
          .map((each: Record) => {
            const orderTotal = Number(each.orderValue) * Number(each.items);
            const orderTotalWithTax =
              orderTotal + orderTotal * (Number(each.taxes) / 100);

            return orderTotalWithTax;
          })
          .reduce((prev: number, next: number) => prev + next)
          .toFixed(2);

        setTotals({
          sub_total: subTotal,
          tax_total: Number((total - subTotal).toFixed(2)),
          total: total,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("--------query sales error", error);
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <Row style={style}>
      <Typography.Paragraph strong>Overdue Orders</Typography.Paragraph>
      <OverdueSalesTable isLoading={isLoading} orders={orders} />
      <Typography.Paragraph>
        <p>All Orders</p>
        <ul>
          <li>
            Sub Total: <span className="price bold">{totals.sub_total}</span>
          </li>
          <li>
            Tax Total: <span className="price bold">{totals.tax_total}</span>
          </li>
          <li>
            Total: <span className="price bold">{totals.total}</span>
          </li>
        </ul>
      </Typography.Paragraph>
    </Row>
  );
};

OverdueSales.displayName = "OverdueSales";

export default memo(OverdueSales);
