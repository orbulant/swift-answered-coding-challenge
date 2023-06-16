import { Table } from "antd";
import { memo, useState, useMemo, useCallback } from "react";
import { Record, Store } from "../types/types";

import { getFlagEmoji } from "../utils";

const OverdueSalesTable = ({ orders = [], isLoading = false }: any) => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const columns = useMemo(
    () => [
      {
        title: "MARKETPLACE",
        render: (record: Record) => {
          const flag = getFlagEmoji(record.store.country.slice(0, 2));
          return (
            <div
              style={{
                fontWeight: "normal",
                display: "flex",
                flexDirection: "row",
              }}
            >
              {`${flag} ${record.store.marketplace}`}
            </div>
          );
        },
        sorter: (a: Record, b: Record) =>
          a.store.marketplace.localeCompare(b.store.marketplace),
        responsive: ["md"],
      },
      {
        title: "STORE",
        render: (record: any) => record.store.shopName,
        sorter: (a: Record, b: Record) =>
          a.store.shopName.localeCompare(b.store.shopName),
        responsive: ["md"],
      },
      {
        title: "ORDER ID",
        dataIndex: "orderId",
        sorter: (a: Record, b: Record) => a.orderId.localeCompare(b.orderId),
      },
      {
        title: "ITEMS",
        dataIndex: "items",
        sorter: (a: Record, b: Record) => Number(a.items) - Number(b.items),
        align: "center",
      },
      {
        title: "DESTINATION",
        dataIndex: "destination",
        sorter: (a: Record, b: Record) =>
          a.destination.localeCompare(b.destination),
        responsive: ["md"],
      },
      {
        title: "DAYS OVERDUE",
        render: (record: Record) => {
          const dateParts = record.latest_ship_date.split("/");

          const latestShipDate = new Date(
            Number(dateParts[2]),
            Number(dateParts[1]),
            Number(dateParts[0])
          );
          const currDate = Date.now();
          const diffTime = Math.abs(currDate - latestShipDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (record.shipment_status === "Shipped") {
            return (
              <p className="overdue">
                {diffDays} <span className="fulfilled">(Fulfilled)</span>
              </p>
            );
          }
          return <p className="overdue">{diffDays}</p>;
        },
        sorter: (a: Record, b: Record) => {
          const aDateParts = a.latest_ship_date.split("/");

          const aLatestShipDate = new Date(
            Number(aDateParts[2]),
            Number(aDateParts[1]),
            Number(aDateParts[0])
          );

          const bDateParts = b.latest_ship_date.split("/");

          const bLatestShipDate = new Date(
            Number(bDateParts[2]),
            Number(bDateParts[1]),
            Number(bDateParts[0])
          );

          return aLatestShipDate.getTime() - bLatestShipDate.getTime();
        },
        responsive: ["md"],
        align: "right",
      },
      {
        title: "ORDER VALUE",
        dataIndex: "orderValue",
        sorter: (a: Record, b: Record) =>
          Number(a.orderValue) - Number(b.orderValue),
        responsive: ["md"],
        align: "right",
      },
      {
        title: "ORDER TAXES",
        render: (record: Record) => {
          return <p className="taxes">{record.taxes}</p>;
        },
        sorter: (a: Record, b: Record) => Number(a.taxes) - Number(b.taxes),
        responsive: ["md"],
        align: "right",
      },
      {
        title: "ORDER TOTAL",
        render: (record: Record) => {
          const orderTotal = Number(record.items) * Number(record.orderValue);
          const orderTotalWithTax =
            orderTotal + orderTotal * (Number(record.taxes) / 100);
          return <p className="price">{orderTotalWithTax.toFixed(2)}</p>;
        },
        sorter: (a: Record, b: Record) => {
          const aOrderTotal = Number(a.items) * Number(a.orderValue);
          const bOrderTotal = Number(b.items) * Number(b.orderValue);

          return aOrderTotal - bOrderTotal;
        },
        responsive: ["md"],
        align: "right",
      },
    ],
    []
  );

  const onChange = useCallback((current: number, pageSize: number) => {
    setPagination({ current, pageSize });
  }, []);

  const showTotal = useCallback((total: any, range: any) => {
    return `${range[0]} - ${range[1]} of ${total}`;
  }, []);

  const paginationObj = useMemo(
    () => ({
      onChange,
      showTotal,
      pageSizeOptions: [5, 10],
      ...pagination,
    }),
    [onChange, pagination, showTotal]
  );

  return (
    <Table
      size="small"
      // @ts-ignore
      columns={columns}
      loading={isLoading}
      dataSource={orders}
      pagination={paginationObj}
    />
  );
};

OverdueSalesTable.displayName = "OverdueSalesTable";

export default memo(OverdueSalesTable);
