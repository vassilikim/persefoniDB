from faker import Faker
import random
from datetime import datetime, timedelta

fake = Faker()

# Define the roles and corresponding school IDs
roles = {
    'super-admin': None,
    'school-admin': [1, 2, 3],
    'teacher': None,
    'student': None
}

# Generate the SQL script
sql_script = ''

# Add the super-admin user
sql_script += f"INSERT INTO Users (username, user_password, user_role, first_name, last_name, birth_date) " \
              f"VALUES ('superadmin', 'test1234', 'super-admin', 'Super', 'Admin', " \
              f"'{fake.date_of_birth(minimum_age=18, maximum_age=50).strftime('%Y-%m-%d')}');\n"

# Add the school-admin users
for i in range(3):
    school_id = i + 1
    first_name = fake.first_name()
    last_name = fake.last_name()
    birth_date = fake.date_of_birth(minimum_age=18, maximum_age=50)
    sql_script += f"INSERT INTO Users (username, user_password, user_role, first_name, last_name, birth_date, " \
                  f"school_ID) " \
                  f"VALUES ('schooladmin{i+1}', 'test1234', 'school-admin', '{first_name}', '{last_name}', " \
                  f"'{birth_date.strftime('%Y-%m-%d')}', {school_id});\n"

# Add the teacher and student users
for role in roles:
    if role != 'super-admin' and role != 'school-admin':
        for i in range(30 if role == 'student' else 10):
            school_id = random.choice(roles['school-admin'])
            first_name = fake.first_name()
            last_name = fake.last_name()
            if role == 'student':
                birth_date = fake.date_of_birth(maximum_age=17)
            else:
                birth_date = fake.date_of_birth(minimum_age=18, maximum_age=25)
            sql_script += f"INSERT INTO Users (username, user_password, user_role, first_name, last_name, " \
                          f"birth_date, school_ID) " \
                          f"VALUES ('{role}{i+1}', 'test1234', '{role}', '{first_name}', '{last_name}', " \
                          f"'{birth_date.strftime('%Y-%m-%d')}', {school_id});\n"

# Print the SQL script
print(sql_script)
