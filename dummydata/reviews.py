import random

# Generate 20 review records
reviews = []
for i in range(20):
    user_id = random.randint(5, 44)
    book_id = random.randint(1, 100)
    review = "This book was {}.".format(random.choice(["amazing", "great", "good", "okay", "disappointing"]))
    rating = random.randint(0, 5)
    review_record = (user_id, book_id, review, rating)
    reviews.append(review_record)

# Generate SQL code to insert review records
sql_code = "INSERT INTO Review (user_ID, book_ID, review, rating) VALUES\n"
values = []
for review in reviews:
    values.append("({}, {}, '{}', {})".format(review[0], review[1], review[2], review[3]))
sql_code += ",\n".join(values) + ";"
print(sql_code)

