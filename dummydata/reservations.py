import random
from datetime import datetime, timedelta

reservations = []
for i in range(40):
    user_id = random.randint(5, 44)
    book_id = random.randint(1, 100)
    reservation_status = random.randint(0, 3)
    request_date = datetime.now() - timedelta(days=random.randint(0, 365))
    pending_reservation_date = request_date + timedelta(days=random.randint(1, 14)) if reservation_status == 1 else None
    if pending_reservation_date is not None and pending_reservation_date <= request_date:
        pending_reservation_date = request_date + timedelta(days=random.randint(1, 14))
    canceled_at = request_date + timedelta(days=random.randint(1, 14)) if reservation_status == 3 else None
    if canceled_at is not None and pending_reservation_date is not None and canceled_at <= pending_reservation_date:
        canceled_at = pending_reservation_date + timedelta(days=random.randint(1, 14))
    served_at = request_date + timedelta(days=random.randint(1, 14)) if reservation_status == 2 else None
    if served_at is not None and canceled_at is not None and served_at <= canceled_at:
        served_at = canceled_at + timedelta(days=random.randint(1, 14))
    reservations.append((user_id, book_id, request_date, pending_reservation_date, canceled_at, served_at, reservation_status))

sql_script = "INSERT INTO Reservation (user_ID, book_ID, request_date, pending_reservation_date, canceled_at, served_at, reservation_status) VALUES\n"
for i, reservation in enumerate(reservations):
    values = "(" + str(reservation[0]) + ", " + str(reservation[1]) + ", '" + reservation[2].strftime('%Y-%m-%d %H:%M:%S') + "', "
    values += "NULL" if reservation[3] is None else "'" + reservation[3].strftime('%Y-%m-%d %H:%M:%S') + "'"
    if reservation[3] is not None and reservation[4] is not None and reservation[4] <= reservation[3]:
        reservation[4] = reservation[3] + timedelta(days=random.randint(1, 14))
    values += ", NULL" if reservation[4] is None else ", '" + reservation[4].strftime('%Y-%m-%d %H:%M:%S') + "'"
    if reservation[4] is not None and reservation[5] is not None and reservation[5] <= reservation[4]:
        reservation[5] = reservation[4] + timedelta(days=random.randint(1, 14))
    values += ", NULL" if reservation[5] is None else ", '" + reservation[5].strftime('%Y-%m-%d %H:%M:%S') + "'"
    values += ", " + str(reservation[6]) + ")"
    if i < len(reservations) - 1:
        values += ","
    values += "\n"
    sql_script += values


print(sql_script)
