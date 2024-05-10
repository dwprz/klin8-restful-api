# get all
SELECT o.*, s.*
FROM orders as o
    INNER JOIN statuses as s ON s."orderId" = o."orderId"
ORDER BY s."statusId" ASC
LIMIT 20
OFFSET
    0;

# get by customer name
SELECT o.*, s.*
FROM orders as o
    INNER JOIN statuses as s ON s."orderId" = o."orderId"
WHERE
    to_tsvector("customerName") @@ to_tsquery('abc')
ORDER BY s."statusId" ASC
LIMIT 1
OFFSET
    1;

# get by status
SELECT 
    o.*, s.*
FROM 
    orders as o
INNER JOIN
    statuses as s ON s."orderId" = o."orderId"
WHERE 
    o."orderId" IN (
        SELECT
            "orderId"
        FROM
            statuses
        WHERE
            "statusName"::text = 'IN_PROGRESS'
            AND
            "isCurrentStatus" = TRUE
    )
ORDER BY
    s."statusId" ASC
LIMIT 20 OFFSET 0;

# get uncompleted orders
SELECT 
    o.*, s.*
FROM 
    orders as o
INNER JOIN
    statuses as s ON s."orderId" = o."orderId"
WHERE 
    o."orderId" IN (
        SELECT
            "orderId"
        FROM
            statuses
        WHERE
            "statusName"::text != 'COMPLETED'
            AND
            "statusName"::text != 'CANCELED'
            AND
            "isCurrentStatus" = TRUE
    )
ORDER BY
    s."statusId" ASC
LIMIT 20 OFFSET 0;

# get by current user
SELECT o.*, s.*
FROM orders as o
    INNER JOIN statuses as s ON s."orderId" = o."orderId"
WHERE
    o."userId" = 1
    AND o."isDeleted" = FALSE
ORDER BY s."statusId" ASC
LIMIT 1
OFFSET
    1;

# total orders
SELECT CAST(COUNT("orderId") as INTEGER) as "totalOrders" FROM orders;

# total orders by customer
SELECT 
    CAST(COUNT("orderId") as INTEGER) as "totalOrders" 
FROM 
    orders
WHERE
    to_tsvector("customerName") @@ to_tsquery('abc');

# total orders by status
SELECT 
    CAST(COUNT("orderId") as INTEGER) as "totalOrders" 
FROM 
    statuses
WHERE
    "statusName"::text = 'COMPLETED' AND "isCurrentStatus" = TRUE;

# total orders by current user
SELECT 
    CAST(COUNT("orderId") as INTEGER) as "totalOrders" 
FROM 
    orders
WHERE
    "userId" = 1 AND "isDeleted" = FALSE;

# total uncompleted orders
SELECT 
    CAST(COUNT("orderId") as INTEGER) as "totalOrders" 
FROM 
    statuses
WHERE
    "statusName"::text != 'COMPLETED' 
    AND 
    "statusName"::text != 'CANCELED' 
    AND 
    "isCurrentStatus" = TRUE;


SELECT * FROM orders;

  SELECT 
    * 
  FROM 
      orders as o 
  INNER JOIN 
      statuses as s ON s."orderId" = o."orderId"
  ORDER BY
      s."statusId" ASC
  LIMIT 20 OFFSET 0;

 SELECT * FROM orders  
  ORDER BY "createdAt" DESC
  LIMIT 20 OFFSET 0;