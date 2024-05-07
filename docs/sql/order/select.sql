# get all
SELECT 
    o.*, s.*
FROM 
    orders as o 
INNER JOIN 
    statuses as s ON s."orderId" = o."orderId"
ORDER BY
    o."createdAt" DESC 
LIMIT 1 OFFSET 1;


# get by customer name
SELECT 
    o.*, s.*
FROM 
    orders as o
INNER JOIN
    statuses as s ON s."orderId" = o."orderId"
WHERE 
    to_tsvector("customerName") @@ to_tsquery('abc')
ORDER BY
    o."createdAt" DESC
LIMIT 1 OFFSET 1;

# get by status
SELECT 
    o.*, s.*
FROM 
    orders as o
INNER JOIN
    statuses as s ON s."orderId" = o."orderId"
WHERE 
    s."statusName"::text = 'PENDING_PICK_UP'
ORDER BY
    o."createdAt" DESC
LIMIT 1 OFFSET 1;

# get by current user
SELECT 
    o.*, s.*
FROM 
    orders as o
INNER JOIN
    statuses as s ON s."orderId" = o."orderId"
WHERE 
    o."userId" = 1 AND o."isDeleted" = FALSE
ORDER BY
    o."createdAt" DESC
LIMIT 1 OFFSET 1;

SELECT * FROM orders
WHERE "orderId" = 1;

SELECT * FROM statuses
WHERE "orderId" = 1;