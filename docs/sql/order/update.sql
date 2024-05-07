UPDATE statuses
SET
    "isCurrentStatus" = CASE
        WHEN "statusName"::text = 'PENDING_PICK_UP' THEN TRUE
        ELSE FALSE
    END,
    "date" = CASE
        WHEN "statusName"::text = 'PENDING_PICK_UP' THEN now()
        ELSE "date"
    END
WHERE
    "orderId" = 1;