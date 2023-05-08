from faker import Faker
import random

fake = Faker()

# Generate 3 schools
schools = []
for i in range(3):
    school_name = fake.company()
    address = fake.address()
    city = fake.city()
    phone = fake.phone_number()
    email = fake.email()
    principal = fake.name()
    
    schools.append((school_name, address, city, phone, email, principal))

# Generate SQL script to insert schools into the database
sql_script = ""
for school in schools:
    sql_script += f"INSERT INTO School (school_name, address, city, phone, email, principal) VALUES ('{school[0]}', '{school[1]}', '{school[2]}', '{school[3]}', '{school[4]}', '{school[5]}');\n"

print(sql_script)
