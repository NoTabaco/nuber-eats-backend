# Nuber Eats Backend

The Backend of Nuber Eats Clone

- Orders Subscription:

  - Pending Orders (Owner) (s: createOrder) (t: createOrder(newOrder))
  - Order Status (Customer, Delivery, Owner) (s: orderUpdate) (t: editOrder(orderUpdate))
  - Pending Pickup Order (Delivery) (s: orderUpdate) (t: editOrder(orderUpdate))

- Payments (CRON)
