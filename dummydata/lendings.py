import random
from datetime import datetime, timedelta

# Generate 50 lending records
lendings = []
for i in range(50):
    user_id = random.randint(5, 44)
    book_id = random.randint(1, 100)
    lending_date = datetime.now() - timedelta(days=random.randint(0, 30))
    must_be_returned_at = lending_date + timedelta(days=30)
    was_returned_at = None
    if random.random() < 0.8:
        was_returned_at = lending_date + timedelta(days=random.randint(1, 29))
    lending = (user_id, book_id, lending_date, must_be_returned_at, was_returned_at)
    lendings.append(lending)

# Generate SQL code to insert lending records
sql_code = "INSERT INTO Lending (user_ID, book_ID, lending_date, must_be_returned_at, was_returned_at) VALUES\n"
values = []
for lending in lendings:
    if lending[4] is None:
        was_returned_at = 'NULL'
    else:
        was_returned_at = "'" + str(lending[4]) + "'"
    values.append("({}, {}, '{}', '{}', {})".format(lending[0], lending[1], lending[2], lending[3], was_returned_at))
sql_code += ",\n".join(values) + ";"
print(sql_code)
