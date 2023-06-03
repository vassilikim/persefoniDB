DROP DATABASE IF EXISTS <db_name>;
CREATE DATABASE <db_name>;
USE <db_name>;

CREATE TABLE School (
    ID INT NOT NULL AUTO_INCREMENT,
    school_name VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    principal VARCHAR(255) NOT NULL,
    school_active BIT NOT NULL DEFAULT(0),
    PRIMARY KEY (ID),
    INDEX school_active_index (school_active)
);

CREATE TABLE Book (
    ID INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    publisher VARCHAR(255) NOT NULL,
    ISBN VARCHAR(255) NOT NULL,
    page_number INT NOT NULL,
    summary VARCHAR(1000) NOT NULL,
    copies INT NOT NULL,
    image VARCHAR(255) NOT NULL,
    lang VARCHAR(255) NOT NULL,
    keywords VARCHAR(255) NOT NULL,
    school_ID INT NOT NULL,
    PRIMARY KEY (ID),
    UNIQUE KEY (title, school_id),
    FOREIGN KEY (school_ID) REFERENCES School(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT CHECK (copies>=0),
    INDEX index_book_school (school_ID)
);

CREATE TABLE Writer (
    ID INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (ID)
);

CREATE TABLE Writes (
    writer_ID INT NOT NULL,
    book_ID INT NOT NULL,
    PRIMARY KEY (writer_ID, book_ID),
    FOREIGN KEY (writer_ID) REFERENCES Writer(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (book_ID) REFERENCES Book(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX index_book_written (book_ID)
);

CREATE TABLE Genre (
    book_ID INT NOT NULL,
    genre VARCHAR(255) NOT NULL,
    PRIMARY KEY (genre, book_ID),
    FOREIGN KEY (book_ID) REFERENCES Book(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX index_book_genre (book_ID)
);

CREATE TABLE Users (
    ID INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_role ENUM('super-admin', 'school-admin', 'teacher', 'student') NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    birth_date DATETIME NOT NULL,
    school_ID INT DEFAULT(NULL),
    verified BIT NOT NULL DEFAULT(0),
    changed_password_at DATETIME DEFAULT(NULL),
    PRIMARY KEY (ID),
    FOREIGN KEY (school_ID) REFERENCES School(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX index_user_school (school_ID)
);

CREATE TABLE Reservation (
    user_ID INT NOT NULL,
    book_ID INT NOT NULL,
    request_date DATETIME NOT NULL DEFAULT(NOW()),
    pending_reservation_date DATETIME DEFAULT(NULL),
    canceled_at DATETIME DEFAULT(NULL),
	served_at DATETIME DEFAULT(NULL),
    reservation_status INT NOT NULL DEFAULT(0),
    PRIMARY KEY (user_ID, book_ID, request_date),
    FOREIGN KEY (user_ID) REFERENCES Users(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (book_ID) REFERENCES Book(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX index_reserv_book (book_ID, user_ID)
);

CREATE TABLE Lending (
    user_ID INT NOT NULL,
    book_ID INT NOT NULL,
    lending_date DATETIME NOT NULL DEFAULT(NOW()),
    must_be_returned_at DATETIME NOT NULL DEFAULT(DATE_ADD(NOW(),INTERVAL 1 MONTH)),
	was_returned_at DATETIME DEFAULT(NULL),
    PRIMARY KEY (user_ID, book_ID, lending_date),
    FOREIGN KEY (user_ID) REFERENCES Users(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (book_ID) REFERENCES Book(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX index_lend_book (book_ID, user_ID)
);

CREATE TABLE Review (
    user_ID INT NOT NULL,
    book_ID INT NOT NULL,
    review VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    verified BIT NOT NULL DEFAULT(0),
    PRIMARY KEY (user_ID, book_ID),
    FOREIGN KEY (user_ID) REFERENCES Users(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (book_ID) REFERENCES Book(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    CHECK (rating<=5 AND rating>=0),
    INDEX index_review_book (book_ID, user_ID)
);

CREATE VIEW activeUsers AS
(SELECT u.* FROM Users u JOIN School s ON u.school_ID=s.ID WHERE s.school_active=1)
UNION
(SELECT * FROM Users WHERE user_role='super-admin');

CREATE VIEW verifiedUsers AS
SELECT * FROM activeUsers WHERE verified=1;

DELIMITER $$
CREATE TRIGGER update_user_verification
BEFORE INSERT ON Users
FOR EACH ROW
BEGIN
    IF NEW.user_role = 'super-admin' THEN
        SET NEW.verified = 1;
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER update_review_verification
BEFORE INSERT ON Review
FOR EACH ROW
BEGIN
    IF (SELECT user_role FROM Users WHERE ID=New.user_id)='teacher' THEN
		SET New.verified = 1;
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER make_school_active
BEFORE INSERT ON Users
FOR EACH ROW
BEGIN
    IF (NEW.user_role = 'school-admin' AND 
    (SELECT COUNT(*) FROM Users WHERE (user_role='school-admin'AND school_ID=NEW.school_ID))=0) THEN
        UPDATE School SET school_active=1 WHERE ID=NEW.school_ID;
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER make_school_inactive
AFTER DELETE ON Users
FOR EACH ROW
BEGIN
    IF (OLD.user_role = 'school-admin' AND 
    (SELECT COUNT(*) FROM Users WHERE (user_role='school-admin'AND school_ID=OLD.school_ID))=0) THEN
        UPDATE School SET school_active=0 WHERE ID=OLD.school_ID;
    END IF;
END$$
DELIMITER ;

DELIMITER //
CREATE TRIGGER hash_password_before_insert BEFORE INSERT ON Users
  FOR EACH ROW
  BEGIN
	SET NEW.user_password = SHA2(CONCAT('kimnamjoonkimseokjinminyoongijunghoseokparkjiminkimtaehyungjeonjungkookbts',
	NEW.user_password), 256);
  END;//

CREATE TRIGGER hash_password_before_update BEFORE UPDATE ON Users
  FOR EACH ROW
  BEGIN
	IF OLD.user_password <> NEW.user_password AND OLD.user_password <> SHA2(CONCAT('kimnamjoonkimseokjinminyoongijunghoseokparkjiminkimtaehyungjeonjungkookbts', NEW.user_password), 256) THEN
		SET NEW.user_password = SHA2(CONCAT('kimnamjoonkimseokjinminyoongijunghoseokparkjiminkimtaehyungjeonjungkookbts',
		NEW.user_password), 256);
	END IF;
  END;//
DELIMITER ;

DELIMITER $$
CREATE TRIGGER add_three_hours_to_birth_date_insert
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    SET NEW.birth_date = DATE_ADD(NEW.birth_date, INTERVAL 3 HOUR);
END$$

CREATE TRIGGER add_three_hours_to_birth_date_update
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    IF NEW.birth_date <> OLD.birth_date THEN
        SET NEW.birth_date = DATE_ADD(NEW.birth_date, INTERVAL 3 HOUR);
    END IF;
END$$
DELIMITER ;



DELIMITER //
CREATE FUNCTION change_password(user_username VARCHAR(255), old_password VARCHAR(255), new_password VARCHAR(255)) 
RETURNS VARCHAR(255) DETERMINISTIC
BEGIN
  IF (SELECT user_password FROM Users WHERE username=user_username) = SHA2(CONCAT('kimnamjoonkimseokjinminyoongijunghoseokparkjiminkimtaehyungjeonjungkookbts', old_password), 256) THEN
    IF new_password=old_password THEN RETURN "OK"; END IF;
    UPDATE Users SET user_password=new_password, changed_password_at=NOW() WHERE username = user_username;
    RETURN 'OK';
  ELSE 
	RETURN 'NOT OK';
  END IF;
END//
DELIMITER ;

DELIMITER //
CREATE FUNCTION check_user_login(p_username VARCHAR(255), p_password VARCHAR(255)) 
RETURNS INT DETERMINISTIC
BEGIN
  DECLARE count INT DEFAULT 0;
  
  IF (SELECT user_role FROM Users WHERE username = p_username) = 'super-admin' THEN
    SELECT COUNT(*) INTO count FROM Users WHERE username = p_username AND verified = 1 AND user_password = SHA2(CONCAT('kimnamjoonkimseokjinminyoongijunghoseokparkjiminkimtaehyungjeonjungkookbts', p_password), 256);
  ELSE
    SELECT COUNT(*) INTO count FROM verifiedUsers
    WHERE username = p_username AND user_password = SHA2(CONCAT('kimnamjoonkimseokjinminyoongijunghoseokparkjiminkimtaehyungjeonjungkookbts', p_password), 256);
  END IF;
  
  RETURN count;
END//
DELIMITER ;

DELIMITER //
CREATE FUNCTION make_reservation(book_title VARCHAR(255), school INT, user INT, role VARCHAR(255)) 
RETURNS VARCHAR(255) DETERMINISTIC
BEGIN
	SET @book = (SELECT ID FROM Book WHERE title = book_title AND school_ID = school);
    IF @book IS NULL THEN RETURN 'NO BOOK'; END IF;
	IF role = 'teacher' THEN SET @reservationsAllowed=1;
	ELSEIF role = 'student' THEN SET @reservationsAllowed=2;
	END IF;
    IF (SELECT COUNT(*) FROM Reservation WHERE user_ID=user AND book_ID=@book AND (reservation_status=0 OR reservation_status=1)) <> 0 THEN
		RETURN 'ALREADY RESERVATION';
	ELSEIF (SELECT COUNT(*) FROM Lending WHERE user_ID=user AND book_ID=@book AND was_returned_at IS NULL) <> 0 THEN
		RETURN 'ALREADY LENDING';
	ELSEIF (SELECT COUNT(*) FROM Lending WHERE user_ID=user AND was_returned_at IS NULL AND must_be_returned_at<NOW()) <> 0 THEN
		RETURN 'DELAY';
	ELSEIF (SELECT COUNT(*) FROM Reservation WHERE user_ID=user AND reservation_status=0) > (@reservationsAllowed-1) THEN
		RETURN 'TOO MANY';
	ELSE 
		INSERT INTO Reservation (user_ID, book_ID) VALUES (user, @book);
		RETURN 'OK';
	END IF;
END//
DELIMITER ;

DELIMITER //
CREATE FUNCTION handle_reservation(book_title VARCHAR(255), school INT, u_username VARCHAR(255)) 
RETURNS VARCHAR(255) DETERMINISTIC
BEGIN
	SET @book = (SELECT ID FROM Book WHERE title = book_title AND school_ID = school);
    IF @book IS NULL THEN RETURN 'NO BOOK'; 
    END IF;
    
    SET @libraryuser = (SELECT ID FROM verifiedUsers WHERE username = u_username AND school_ID = school AND (user_role='teacher' OR user_role='student'));
    IF @libraryuser IS NULL THEN RETURN 'NO USER'; 
    END IF;
    
    SET @userrole = (SELECT user_role FROM verifiedUsers WHERE username = u_username AND school_ID = school);
    
    IF (SELECT COUNT(*) FROM Reservation WHERE user_ID=@libraryuser AND book_ID=@book AND (reservation_status=0 OR reservation_status=1)) = 0 THEN
		SET @original = true;
	ELSE 
		SET @original = false;
	END IF;
    
	IF @userrole = 'teacher' THEN 
		SET @lendingsAllowed=1;
	ELSEIF @userrole = 'student' THEN 
		SET @lendingsAllowed=2;
	END IF;
    
    IF (SELECT COUNT(*) FROM Lending WHERE user_ID=@libraryuser AND book_ID=@book AND was_returned_at IS NULL) <> 0 THEN
		RETURN 'ALREADY LENDING';
	ELSEIF (SELECT COUNT(*) FROM Lending WHERE user_ID=@libraryuser AND was_returned_at IS NULL AND must_be_returned_at<NOW()) <> 0 THEN
		RETURN 'DELAY';
	ELSEIF (SELECT copies FROM Book WHERE ID=@book) = 0 THEN
		IF @original = false THEN
			UPDATE Reservation SET pending_reservation_date=NOW(), reservation_status=1 WHERE user_ID=@libraryuser AND book_ID=@book AND reservation_status=0;
            RETURN 'NO COPY, UPDATED TO PENDING';
		ELSE 
			RETURN 'NO COPY';
		END IF;
	ELSEIF (SELECT COUNT(*) FROM Lending WHERE user_ID=@libraryuser AND was_returned_at IS NULL) > (@lendingsAllowed-1) THEN
		RETURN 'TOO MANY';
	ELSE 
		INSERT INTO Lending (user_ID, book_ID) VALUES (@libraryuser, @book);
        UPDATE Book SET copies=copies-1 WHERE ID=@book;
        UPDATE Reservation SET served_at=NOW(), reservation_status=2 WHERE user_ID=@libraryuser AND book_ID=@book AND (reservation_status=0 OR reservation_status=1);
		RETURN 'OK';
	END IF;
END//
DELIMITER ;

DELIMITER //
CREATE FUNCTION return_book(book_title VARCHAR(255), school INT, u_username VARCHAR(255)) 
RETURNS VARCHAR(255) DETERMINISTIC
BEGIN
	SET @book = (SELECT ID FROM Book WHERE title = book_title AND school_ID = school);
    IF @book IS NULL THEN RETURN 'NO BOOK'; 
    END IF;
    
    SET @libraryuser = (SELECT ID FROM verifiedUsers WHERE username = u_username AND school_ID = school AND (user_role='teacher' OR user_role='student'));
    IF @libraryuser IS NULL THEN RETURN 'NO USER'; 
    END IF;
    
    IF (SELECT COUNT(*) FROM Lending WHERE user_ID=@libraryuser AND book_ID=@book AND was_returned_at IS NULL) = 0 THEN
		RETURN 'NO LENDING';
	ELSE 
		UPDATE Book SET copies=copies+1 WHERE ID=@book;
        UPDATE Lending SET was_returned_at=NOW() WHERE user_ID=@libraryuser AND book_ID=@book;
        RETURN 'OK';
	END IF;
END//
DELIMITER ;

DELIMITER //
CREATE FUNCTION cancel_reservation(book_title VARCHAR(255), school INT, u_username VARCHAR(255)) 
RETURNS VARCHAR(255) DETERMINISTIC
BEGIN
	SET @book = (SELECT ID FROM Book WHERE title = book_title AND school_ID = school);
    IF @book IS NULL THEN RETURN 'NO BOOK'; 
    END IF;
    
    SET @libraryuser = (SELECT ID FROM verifiedUsers WHERE username = u_username AND school_ID = school AND (user_role='teacher' OR user_role='student'));
    
    IF (SELECT COUNT(*) FROM Reservation WHERE user_ID=@libraryuser AND book_ID=@book AND (reservation_status=0 OR reservation_status=1)) = 0 THEN
		RETURN 'NO RESERVATION';
	ELSE 
        UPDATE Reservation SET canceled_at=NOW(), reservation_status=3 WHERE user_ID=@libraryuser AND book_ID=@book;
        RETURN 'OK';
	END IF;
END//
DELIMITER ;

DELIMITER //
CREATE FUNCTION deactivate_user(school INT, u_username VARCHAR(255)) 
RETURNS VARCHAR(255) DETERMINISTIC
BEGIN
    SET @libraryuser = (SELECT ID FROM verifiedUsers WHERE username = u_username AND school_ID = school AND (user_role='teacher' OR user_role='student'));
    IF @libraryuser IS NULL THEN RETURN 'NO USER';
    END IF;
    
    UPDATE Reservation SET canceled_at=NOW(), reservation_status=3 WHERE user_ID=@libraryuser AND (reservation_status=0 OR reservation_status=1);
    UPDATE Book b JOIN Lending l ON l.book_ID=b.ID SET b.copies=b.copies+1, l.was_returned_at=NOW() WHERE l.user_ID=@libraryuser AND l.was_returned_at IS NULL;
    UPDATE Review SET verified=0 WHERE user_ID=@libraryuser;
    UPDATE Users SET verified=0 WHERE ID=@libraryuser;
    RETURN 'OK';
END//
DELIMITER ;

DELIMITER //
CREATE FUNCTION verify_teacher_student(school INT, u_username VARCHAR(255)) 
RETURNS VARCHAR(255) DETERMINISTIC
BEGIN
	DECLARE libraryuser INT;
    DECLARE u_role VARCHAR(255);
    SELECT ID, user_role INTO @libraryuser, u_role FROM activeUsers WHERE username = u_username AND school_ID = school AND (user_role='teacher' OR user_role='student');
    IF @libraryuser IS NULL THEN RETURN 'NO USER';
    END IF;
    
    UPDATE Users SET verified=1 WHERE ID=@libraryuser;
    IF u_role = 'teacher' THEN 
		UPDATE Review SET verified=1 WHERE user_ID=@libraryuser;
	END IF;
    RETURN 'OK';
END//
DELIMITER ;

DELIMITER //
CREATE FUNCTION delete_user(school INT, u_username VARCHAR(255)) 
RETURNS VARCHAR(255) DETERMINISTIC
BEGIN
    SET @libraryuser = (SELECT ID FROM activeUsers WHERE username = u_username AND school_ID = school AND (user_role='teacher' OR user_role='student'));
    IF @libraryuser IS NULL THEN RETURN 'NO USER';
    END IF;
    
    DELETE FROM Reservation WHERE user_ID=@libraryuser;
    UPDATE Book b JOIN Lending l ON l.book_ID=b.ID SET b.copies=b.copies+1 WHERE l.user_ID=@libraryuser AND l.was_returned_at IS NULL;
    DELETE FROM Lending WHERE user_ID=@libraryuser;
    DELETE FROM Review WHERE user_ID=@libraryuser;
    DELETE FROM Users WHERE ID=@libraryuser;
    RETURN 'OK';
END//
DELIMITER ;

DELIMITER //
CREATE FUNCTION make_review(book_title VARCHAR(255), school INT, user INT, review VARCHAR(255), rating FLOAT) 
RETURNS VARCHAR(255) DETERMINISTIC
BEGIN
	SET @book = (SELECT ID FROM Book WHERE title = book_title AND school_ID = school);
    IF @book IS NULL THEN RETURN 'NO BOOK'; END IF;
    
    IF (SELECT COUNT(*) FROM Lending WHERE user_ID=user AND book_ID=@book) = 0 THEN
		RETURN 'NO LENDING';
	END IF;
    
    INSERT INTO Review (user_ID, book_ID, review, rating) VALUES (user, @book, review, rating);
	RETURN 'OK';
END//
DELIMITER ;

DELIMITER //
CREATE EVENT cancel_reservations_after_one_week
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
    UPDATE Reservation
    SET canceled_at = NOW(), reservation_status=3
    WHERE request_date <= DATE_SUB(NOW(), INTERVAL 1 WEEK) AND reservation_status=0
    OR pending_reservation_date <= DATE_SUB(NOW(), INTERVAL 1 WEEK) AND reservation_status=1;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE get_lendings_by_school(IN year_param INT, IN month_param INT)
BEGIN
    IF year_param IS NULL AND month_param IS NULL THEN
        SELECT s.school_name, COUNT(l.book_ID) as lendings
		FROM School s 
		JOIN activeUsers u ON s.ID=u.school_ID
		LEFT JOIN Lending l ON l.user_ID=u.ID
		WHERE s.school_active=1
		GROUP BY s.school_name;
    ELSEIF year_param IS NULL AND month_param IS NOT NULL THEN
        SELECT s.school_name, COUNT(CASE WHEN MONTH(l.lending_date) = month_param THEN l.book_ID ELSE NULL END) as lendings
		FROM School s 
		JOIN activeUsers u ON s.ID=u.school_ID
		LEFT JOIN Lending l ON l.user_ID=u.ID
		WHERE s.school_active=1
		GROUP BY s.school_name;
    ELSEIF year_param IS NOT NULL AND month_param IS NULL THEN
        SELECT s.school_name, COUNT(CASE WHEN YEAR(l.lending_date) = year_param THEN l.book_ID ELSE NULL END) as lendings
		FROM School s 
		JOIN activeUsers u ON s.ID=u.school_ID
		LEFT JOIN Lending l ON l.user_ID=u.ID
		WHERE s.school_active=1
		GROUP BY s.school_name;
    ELSE
        SELECT s.school_name, COUNT(CASE WHEN MONTH(l.lending_date) = month_param AND YEAR(l.lending_date) = year_param THEN l.book_ID ELSE NULL END) as lendings
		FROM School s 
		JOIN activeUsers u ON s.ID=u.school_ID
		LEFT JOIN Lending l ON l.user_ID=u.ID
		WHERE s.school_active=1
		GROUP BY s.school_name;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE get_writers_teachers_per_genre(IN genre VARCHAR(255))
BEGIN
    SELECT DISTINCT u.username AS teacher
	FROM activeUsers u 
	JOIN Lending l ON u.ID=l.user_ID
	JOIN Genre g ON g.book_ID=l.book_ID
	WHERE u.user_role='teacher' AND TIMESTAMPDIFF(YEAR, NOW(), l.lending_date)<1 AND g.genre=genre;

	SELECT DISTINCT CONCAT(w.first_name, ' ', w.last_name) AS writer
	FROM Writer w 
	JOIN Writes wr ON wr.writer_ID=w.ID
	JOIN Genre g ON wr.book_ID=g.book_ID
	JOIN School s ON s.school_active=1
	JOIN Book b ON g.book_ID=b.ID AND b.school_ID=s.ID
	WHERE g.genre=genre;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE get_young_teachers_max_books()
BEGIN
	WITH young_teachers_books AS (
		SELECT u.username, COUNT(l.book_ID) AS books
		FROM activeUsers u
		LEFT JOIN Lending l ON u.ID=l.user_ID
		WHERE u.user_role='teacher' AND TIMESTAMPDIFF(YEAR, NOW(), u.birth_date)<40 
		GROUP BY u.username
	)
	SELECT username, books
	FROM young_teachers_books
	WHERE books = (
		SELECT MAX(books)
		FROM young_teachers_books
	);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE get_writers_no_lendings()
BEGIN
	WITH writer_lendings AS (
		SELECT CONCAT(w.first_name, ' ', w.last_name) AS writer, COUNT(l.book_ID) AS lendings
		FROM Writer w 
		LEFT JOIN Writes wr ON wr.writer_ID=w.ID
		LEFT JOIN Book b ON wr.book_ID=b.ID
		LEFT JOIN Lending l ON l.book_ID=b.ID
		JOIN School s ON s.school_active=1 AND b.school_ID=s.ID
		GROUP BY w.first_name, w.last_name
	)
	SELECT writer
	FROM writer_lendings
	WHERE lendings=0;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE get_schooladmins_same_lendings()
BEGIN
	WITH schooladmin_lendings AS (
		SELECT u.username, YEAR(l.lending_date) AS year, COUNT(l.book_ID) AS lendings
		FROM School s
		JOIN activeUsers u ON u.school_ID=s.ID
		JOIN Book b ON b.school_ID=s.ID
		JOIN Lending l ON l.book_ID=b.ID 
		WHERE u.user_role='school-admin'
		GROUP BY u.username, YEAR(l.lending_date)
	)
	SELECT GROUP_CONCAT(sc.username SEPARATOR ', ') AS schooladmins, sc.lendings AS lendings, sc.year
	FROM schooladmin_lendings sc
    WHERE sc.lendings > 20
	GROUP BY sc.lendings, sc.year
	HAVING COUNT(*) >= 2;
    
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE get_top3_genre_pairs()
BEGIN
	SELECT g1.genre AS genre1, g2.genre AS genre2, COUNT(l.book_ID) AS lendings
	FROM Genre g1
	JOIN Genre g2 ON g1.book_ID=g2.book_ID AND g1.genre<g2.genre
	LEFT JOIN Lending l ON g1.book_ID=l.book_ID
	GROUP BY g1.genre, g2.genre
	ORDER BY lendings DESC
	LIMIT 3;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE get_writers_5_less_than_max()
BEGIN
	WITH writer_books AS (
		SELECT CONCAT(w.first_name, ' ', w.last_name) AS writer, COUNT(wr.book_ID) AS books
		FROM Writer w 
		JOIN Writes wr ON wr.writer_ID=w.ID
		GROUP BY w.first_name, w.last_name
		ORDER BY books DESC
	),
	max_books AS (
		SELECT books 
		FROM writer_books
		LIMIT 1
	)
	SELECT w.writer, w.books
	FROM writer_books w
	JOIN max_books m
	WHERE w.books<=m.books-5;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE get_users_delayed_return(IN f_name VARCHAR(255), IN l_name VARCHAR(255), IN delay_days INT, IN school_id INT)
BEGIN
    IF f_name IS NULL AND l_name IS NULL AND delay_days IS NULL THEN
        SELECT b.title, u.username, CONCAT(u.first_name, ' ', u.last_name) AS full_name, l.must_be_returned_at
		FROM activeUsers u
		JOIN Lending l ON u.ID=l.user_ID
        JOIN Book b ON b.ID=l.book_ID
		WHERE l.must_be_returned_at<NOW() AND l.was_returned_at IS NULL AND u.school_ID=school_id;
    ELSEIF f_name IS NOT NULL AND l_name IS NULL AND delay_days IS NULL THEN
        SELECT b.title, u.username, CONCAT(u.first_name, ' ', u.last_name) AS full_name, l.must_be_returned_at
		FROM activeUsers u
		JOIN Lending l ON u.ID=l.user_ID
        JOIN Book b ON b.ID=l.book_ID
		WHERE l.must_be_returned_at<NOW() AND l.was_returned_at IS NULL AND u.school_ID=school_id AND u.first_name=f_name;
    ELSEIF f_name IS NULL AND l_name IS NOT NULL AND delay_days IS NULL THEN
        SELECT b.title, u.username, CONCAT(u.first_name, ' ', u.last_name) AS full_name, l.must_be_returned_at
		FROM activeUsers u
		JOIN Lending l ON u.ID=l.user_ID
        JOIN Book b ON b.ID=l.book_ID
		WHERE l.must_be_returned_at<NOW() AND l.was_returned_at IS NULL AND u.school_ID=school_id AND u.last_name=l_name;
	ELSEIF f_name IS NULL AND l_name IS NULL AND delay_days IS NOT NULL THEN
		SELECT b.title, u.username, CONCAT(u.first_name, ' ', u.last_name) AS full_name, l.must_be_returned_at
		FROM activeUsers u
		JOIN Lending l ON u.ID=l.user_ID
        JOIN Book b ON b.ID=l.book_ID
		WHERE l.must_be_returned_at<NOW() AND l.was_returned_at IS NULL AND u.school_ID=school_id AND TIMESTAMPDIFF(day, l.must_be_returned_at, NOW())=delay_days;
    ELSEIF f_name IS NOT NULL AND l_name IS NOT NULL AND delay_days IS NULL THEN
		SELECT b.title, u.username, CONCAT(u.first_name, ' ', u.last_name) AS full_name, l.must_be_returned_at
		FROM activeUsers u
		JOIN Lending l ON u.ID=l.user_ID
        JOIN Book b ON b.ID=l.book_ID
		WHERE l.must_be_returned_at<NOW() AND l.was_returned_at IS NULL AND u.school_ID=school_id AND u.first_name=f_name AND u.last_name=l_name;
    ELSEIF f_name IS NOT NULL AND l_name IS NULL AND delay_days IS NOT NULL THEN
		SELECT b.title, u.username, CONCAT(u.first_name, ' ', u.last_name) AS full_name, l.must_be_returned_at
		FROM activeUsers u
		JOIN Lending l ON u.ID=l.user_ID
        JOIN Book b ON b.ID=l.book_ID
		WHERE l.must_be_returned_at<NOW() AND l.was_returned_at IS NULL AND u.school_ID=school_id AND u.first_name=f_name AND TIMESTAMPDIFF(day, l.must_be_returned_at, NOW())=delay_days;
    ELSEIF f_name IS NULL AND l_name IS NOT NULL AND delay_days IS NOT NULL THEN
		SELECT b.title, u.username, CONCAT(u.first_name, ' ', u.last_name) AS full_name, l.must_be_returned_at
		FROM activeUsers u
		JOIN Lending l ON u.ID=l.user_ID
        JOIN Book b ON b.ID=l.book_ID
		WHERE l.must_be_returned_at<NOW() AND l.was_returned_at IS NULL AND u.school_ID=school_id AND u.last_name=l_name AND TIMESTAMPDIFF(day, l.must_be_returned_at, NOW())=delay_days;
    ELSE
        SELECT b.title, u.username, CONCAT(u.first_name, ' ', u.last_name) AS full_name, l.must_be_returned_at
		FROM activeUsers u
		JOIN Lending l ON u.ID=l.user_ID
        JOIN Book b ON b.ID=l.book_ID
		WHERE l.must_be_returned_at<NOW() AND l.was_returned_at IS NULL AND u.school_ID=school_id AND u.first_name=f_name AND u.last_name=l_name AND TIMESTAMPDIFF(day, l.must_be_returned_at, NOW())=delay_days;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE get_avg_rating_per_genre_user(IN genre VARCHAR(255), IN full_name VARCHAR(255), IN school_id INT)
BEGIN
    IF genre IS NULL AND full_name IS NULL THEN
        SELECT g.genre, ROUND(AVG(r.rating), 2) AS avg_rating
		FROM Genre g
		JOIN Book b ON b.ID=g.book_ID
		JOIN Review r ON r.book_ID=b.ID
		JOIN activeUsers u ON u.ID=r.user_ID AND u.school_ID=school_id 
        WHERE r.verified=1
		GROUP BY g.genre;
        
        SELECT u.username, CONCAT(u.first_name, ' ', u.last_name) AS full_name, ROUND(AVG(r.rating), 2) AS avg_rating
		FROM activeUsers u
		JOIN Review r ON r.user_ID=u.ID AND u.school_ID=school_id
        WHERE r.verified=1
		GROUP BY u.username, u.first_name, u.last_name;
    ELSEIF genre IS NOT NULL AND full_name IS NULL THEN
        SELECT g.genre, ROUND(AVG(r.rating), 2) AS avg_rating
		FROM Genre g
		JOIN Book b ON b.ID=g.book_ID
		JOIN Review r ON r.book_ID=b.ID
		JOIN activeUsers u ON u.ID=r.user_ID AND u.school_ID=school_id
        WHERE g.genre=genre AND r.verified=1
		GROUP BY g.genre;
        
        SELECT u.username, CONCAT(u.first_name, ' ', u.last_name) AS full_name, ROUND(AVG(r.rating), 2) AS avg_rating
		FROM Genre g
		JOIN activeUsers u ON u.school_ID=school_id
		JOIN Book b ON b.ID=g.book_ID
		JOIN Review r ON r.book_ID=b.ID AND r.user_ID=u.ID
        WHERE g.genre=genre AND r.verified=1
		GROUP BY u.username, u.first_name, u.last_name;
	ELSEIF genre IS NULL AND full_name IS NOT NULL THEN
		SELECT u.username, CONCAT(u.first_name, ' ', u.last_name) AS full_name, g.genre, ROUND(AVG(r.rating), 2) AS avg_rating
		FROM Genre g
		JOIN activeUsers u ON u.school_ID=school_id
		JOIN Book b ON b.ID=g.book_ID
		JOIN Review r ON r.book_ID=b.ID AND r.user_ID=u.ID
        WHERE CONCAT(u.first_name, ' ', u.last_name)=full_name AND r.verified=1
		GROUP BY g.genre, u.username, u.first_name, u.last_name;
        
        SELECT u.username, CONCAT(u.first_name, ' ', u.last_name) AS full_name, ROUND(AVG(r.rating), 2) AS avg_rating
		FROM activeUsers u
		JOIN Review r ON r.user_ID=u.ID AND u.school_ID=school_id
        WHERE CONCAT(u.first_name, ' ', u.last_name)=full_name AND r.verified=1
		GROUP BY u.username, u.first_name, u.last_name;
    ELSE
        SELECT u.username, CONCAT(u.first_name, ' ', u.last_name) AS full_name, g.genre, ROUND(AVG(r.rating), 2) AS avg_rating
		FROM Genre g
		JOIN activeUsers u ON u.school_ID=school_id
		JOIN Book b ON b.ID=g.book_ID
		JOIN Review r ON r.book_ID=b.ID AND r.user_ID=u.ID
        WHERE g.genre=genre AND CONCAT(u.first_name, ' ', u.last_name)=full_name AND r.verified=1
		GROUP BY g.genre, u.username, u.first_name, u.last_name;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE FUNCTION DelSchool(schoolID INT)
RETURNS VARCHAR(255) DETERMINISTIC
BEGIN
	IF (SELECT ID from School where ID = schoolID) IS NULL THEN
		RETURN "NOT OK";
	ELSE 
		CREATE TEMPORARY TABLE delBooks(
			book_id INT PRIMARY KEY
		);
		CREATE TEMPORARY TABLE delWriters(
			id INT AUTO_INCREMENT PRIMARY KEY,
			writer_id INT 
		);

		INSERT INTO delBooks(book_id)
		SELECT ID
		FROM Book
		WHERE school_ID = schoolID;

		INSERT INTO delWriters(writer_id)
		SELECT DISTINCT writer_ID
		FROM Writes
		WHERE book_ID IN (SELECT book_id FROM delBooks);

		DELETE FROM Reservation WHERE book_ID IN (SELECT book_id FROM delBooks);
		DELETE FROM Lending WHERE book_ID IN (SELECT book_id FROM delBooks);
		DELETE FROM Review WHERE book_ID IN (SELECT book_id FROM delBooks);
		DELETE FROM Genre WHERE book_ID IN (SELECT book_id FROM delBooks);
		DELETE FROM Writes WHERE book_ID IN (SELECT book_id FROM delBooks);
		DELETE FROM Writer WHERE ID IN (SELECT writer_id FROM delWriters WHERE writer_id NOT IN (SELECT writer_ID FROM Writes));
		DELETE FROM Book WHERE school_ID=schoolID;
		DELETE FROM Users WHERE school_ID=schoolID;
		DELETE FROM School WHERE ID=schoolID;

		RETURN "OK";
	END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE selectBooks(IN schoolID INT, IN title VARCHAR(255), IN genre VARCHAR(255), IN writer VARCHAR(255), IN copies INT)
BEGIN
	CREATE TEMPORARY TABLE mywrites(
		book_id INT ,
		writer_id int,
		PRIMARY KEY(book_id, writer_id)
	);
	CREATE TEMPORARY TABLE Books(
		book_id INT PRIMARY KEY
	);
	
    IF title IS NULL AND genre IS NULL AND writer IS NULL AND copies IS NULL THEN
		INSERT INTO Books(book_id)
		SELECT b.ID
		FROM Book b
		WHERE b.school_ID = schoolID;
	ELSEIF title IS NOT NULL AND genre IS NULL AND writer IS NULL AND copies IS NULL THEN
		INSERT INTO Books(book_id)
		SELECT b.ID
		FROM Book b
		WHERE b.school_ID = schoolID AND b.title = title;
	ELSEIF title IS NULL AND genre IS NOT NULL AND writer IS NULL AND copies IS NULL THEN
		INSERT INTO Books(book_id)
		SELECT b.ID
		FROM Book b
        JOIN Genre g ON b.ID = g.book_ID
		WHERE b.school_ID = schoolID AND g.genre = genre;
    ELSEIF title IS NULL AND genre IS NULL AND writer IS NOT NULL AND copies IS NULL THEN
		INSERT INTO Books(book_id)
		SELECT b.ID
		FROM Book b
        JOIN Writes wr ON b.ID = wr.book_ID
        JOIN Writer w ON w.ID = wr.writer_ID
		WHERE b.school_ID = schoolID AND CONCAT(W.first_name, ' ', w.last_name) = writer;
    ELSEIF title IS NULL AND genre IS NULL AND writer IS NULL AND copies IS NOT NULL THEN
		INSERT INTO Books(book_id)
		SELECT b.ID
		FROM Book b
		WHERE b.school_ID = schoolID AND b.copies = copies;
    ELSEIF title IS NOT NULL AND genre IS NOT NULL AND writer IS NULL AND copies IS NULL THEN
		INSERT INTO Books(book_id)
		SELECT b.ID
		FROM Book b
        JOIN Genre g ON b.ID = g.book_ID
		WHERE b.school_ID = schoolID AND b.title = title AND g.genre = genre;
    ELSEIF title IS NOT NULL AND genre IS NULL AND writer IS NOT NULL AND copies IS NULL THEN
		INSERT INTO Books(book_id)
		SELECT b.ID
		FROM Book b
        JOIN Writes wr ON b.ID = wr.book_ID
        JOIN Writer w ON w.ID = wr.writer_ID
		WHERE b.school_ID = schoolID AND b.title = title AND CONCAT(W.first_name, ' ', w.last_name) = writer;
    ELSEIF title IS NOT NULL AND genre IS NULL AND writer IS NULL AND copies IS NOT NULL THEN
		INSERT INTO Books(book_id)
		SELECT b.ID
		FROM Book b
		WHERE b.school_ID = schoolID AND b.title = title AND b.copies = copies;
    ELSEIF title IS NULL AND genre IS NOT NULL AND writer IS NOT NULL AND copies IS NULL THEN
		INSERT INTO Books(book_id)
		SELECT b.ID
		FROM Book b
        JOIN Writes wr ON b.ID = wr.book_ID
        JOIN Writer w ON w.ID = wr.writer_ID
        JOIN Genre g ON b.ID = g.book_ID
		WHERE b.school_ID = schoolID AND CONCAT(W.first_name, ' ', w.last_name) = writer AND g.genre = genre;
    ELSEIF title IS NULL AND genre IS NOT NULL AND writer IS NULL AND copies IS NOT NULL THEN
		INSERT INTO Books(book_id)
		SELECT b.ID
		FROM Book b
        JOIN Genre g ON b.ID = g.book_ID
		WHERE b.school_ID = schoolID AND b.copies = copies AND g.genre = genre;
    ELSEIF title IS NULL AND genre IS NULL AND writer IS NOT NULL AND copies IS NOT NULL THEN
		INSERT INTO Books(book_id)
		SELECT b.ID
		FROM Book b
        JOIN Writes wr ON b.ID = wr.book_ID
        JOIN Writer w ON w.ID = wr.writer_ID
		WHERE b.school_ID = schoolID AND b.copies = copies AND CONCAT(W.first_name, ' ', w.last_name) = writer;
    ELSEIF title IS NOT NULL AND genre IS NOT NULL AND writer IS NOT NULL AND copies IS NULL THEN
		INSERT INTO Books(book_id)
		SELECT b.ID
		FROM Book b
        JOIN Writes wr ON b.ID = wr.book_ID
        JOIN Writer w ON w.ID = wr.writer_ID
        JOIN Genre g ON b.ID = g.book_ID
		WHERE b.school_ID = schoolID AND CONCAT(W.first_name, ' ', w.last_name) = writer AND g.genre = genre AND b.title = title;
    ELSEIF title IS NOT NULL AND genre IS NOT NULL AND writer IS NULL AND copies IS NOT NULL THEN
		INSERT INTO Books(book_id)
		SELECT b.ID
		FROM Book b
        JOIN Genre g ON b.ID = g.book_ID
		WHERE b.school_ID = schoolID AND b.title  = title AND b.copies = copies AND g.genre = genre;
    ELSEIF title IS NOT NULL AND genre IS NULL AND writer IS NOT NULL AND copies IS NOT NULL THEN
		INSERT INTO Books(book_id)
		SELECT b.ID
		FROM Book b
        JOIN Writes wr ON b.ID = wr.book_ID
        JOIN Writer w ON w.ID = wr.writer_ID
		WHERE b.school_ID = schoolID AND b.title = title AND b.copies = copies AND CONCAT(W.first_name, ' ', w.last_name) = writer;
    ELSEIF title IS NULL AND genre IS NOT NULL AND writer IS NOT NULL AND copies IS NOT NULL THEN
		INSERT INTO Books(book_id)
		SELECT b.ID
		FROM Book b
        JOIN Writes wr ON b.ID = wr.book_ID
        JOIN Writer w ON w.ID = wr.writer_ID
        JOIN Genre g ON b.ID = g.book_ID
		WHERE b.school_ID = schoolID AND CONCAT(W.first_name, ' ', w.last_name) = writer AND g.genre = genre AND b.copies = copies;
    ELSE 
		INSERT INTO Books(book_id)
		SELECT b.ID
		FROM Book b
        JOIN Writes wr ON b.ID = wr.book_ID
        JOIN Writer w ON w.ID = wr.writer_ID
        JOIN Genre g ON b.ID = g.book_ID
		WHERE b.school_ID = schoolID AND CONCAT(W.first_name, ' ', w.last_name) = writer AND g.genre = genre AND b.title = title AND b.copies = copies;
	END IF;

	INSERT INTO mywrites(book_id, writer_id)
	SELECT book_ID, writer_ID
	FROM Writes
	WHERE book_ID IN (SELECT book_id FROM Books);

	SELECT b.ID, b.title, b.publisher, b.ISBN, b.page_number, b.summary, b.copies, b.image, b.lang, b.keywords, gen.genres, final.full_names
	FROM Book b
	JOIN (SELECT g.book_ID, GROUP_CONCAT(g.genre SEPARATOR ", ") AS genres
		FROM Genre g
		WHERE g.book_ID IN (SELECT book_id FROM Books) GROUP BY g.book_ID) AS gen
	ON b.ID = gen.book_ID
	JOIN (SELECT sm.book_id, GROUP_CONCAT(full_name SEPARATOR ", ") AS full_names 
		FROM (SELECT book_id, CONCAT(first_name, " ", last_name) AS full_name
		FROM (SELECT m.book_id, w.first_name, w.last_name
			FROM mywrites m
			JOIN writer w ON m.writer_id = w.ID) AS books_writers) AS sm GROUP BY book_id) AS final
	ON final.book_id = b.ID;

END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE selectLendedBooks(IN userID INT)
BEGIN
	CREATE TEMPORARY TABLE mywrites(
		book_id INT ,
		writer_id int,
		PRIMARY KEY(book_id, writer_id)
	);
	CREATE TEMPORARY TABLE Books(
		book_id INT PRIMARY KEY
	);
    
    INSERT INTO Books(book_id)
	SELECT b.ID
	FROM Book b
    JOIN Lending l ON b.ID = l.book_ID
	WHERE l.user_ID = userID;

	INSERT INTO mywrites(book_id, writer_id)
	SELECT book_ID, writer_ID
	FROM Writes
	WHERE book_ID IN (SELECT book_id FROM Books);

	SELECT b.ID, b.title, b.publisher, b.ISBN, b.page_number, b.summary, b.copies, b.image, b.lang, b.keywords, gen.genres, final.full_names, l.was_returned_at, l.must_be_returned_at, l.lending_date
	FROM Book b
    JOIN Lending l ON l.book_ID = b.ID
	JOIN (SELECT g.book_ID, GROUP_CONCAT(g.genre SEPARATOR ", ") AS genres
		FROM Genre g
		WHERE g.book_ID IN (SELECT book_id FROM Books) GROUP BY g.book_ID) AS gen
	ON b.ID = gen.book_ID
	JOIN (SELECT sm.book_id, GROUP_CONCAT(full_name SEPARATOR ", ") AS full_names 
		FROM (SELECT book_id, CONCAT(first_name, " ", last_name) AS full_name
		FROM (SELECT m.book_id, w.first_name, w.last_name
			FROM mywrites m
			JOIN writer w ON m.writer_id = w.ID) AS books_writers) AS sm GROUP BY book_id) AS final
	ON final.book_id = b.ID;

END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE extract_names_genre(IN name_string VARCHAR(255), IN genre_string VARCHAR(255), IN book_id INT)
BEGIN
	DECLARE str1 VARCHAR(255);
	DECLARE sub_str1 VARCHAR(255);
	DECLARE str2 VARCHAR(255);
	DECLARE sub_str2 VARCHAR(255);
	DECLARE f_name VARCHAR(255);
	DECLARE l_name VARCHAR(255);
	DECLARE writer_id INT;

	SET str1 = name_string;
	SET str2 = genre_string;

	WHILE (SELECT LENGTH(str1)) > 0 DO
		SET sub_str1 = (SELECT SUBSTRING_INDEX(str1, ",", 1));
		SET f_name = (SELECT SUBSTRING_INDEX(sub_str1, " ", 1));
		SET l_name = (SELECT SUBSTRING_INDEX(sub_str1, " ", -1));
		SET writer_id = (SELECT ID FROM writer WHERE first_name = f_name AND last_name = l_name);
		IF (writer_id) IS NULL THEN 
			INSERT INTO writer (first_name, last_name) VALUES (f_name, l_name);
			SET writer_id = (SELECT ID FROM writer WHERE ID = LAST_INSERT_ID());
		END IF;
		INSERT INTO writes (writer_ID, book_ID) VALUES (writer_id, book_id);
		SET str1 = (SELECT REPLACE(str1, (SELECT CONCAT("", sub_str1, ",")), ""));
	END WHILE;

	WHILE (SELECT LENGTH(str2)) > 0 DO
		SET sub_str2 = (SELECT SUBSTRING_INDEX(str2, ",", 1));
		INSERT INTO genre(book_ID, genre) VALUES (book_id, sub_str2);
		SET str2 = (SELECT REPLACE(str2, (SELECT CONCAT("", sub_str2, ",")), ""));
	END WHILE;
END //
DELIMITER ;

DELIMITER //
CREATE FUNCTION UpdateBook(bookID INT, schoolID INT, publisher_ VARCHAR(255), ISBN_ VARCHAR(255), page_number_ INT, summary_ VARCHAR(255), copies_ INT, image_ VARCHAR(255), lang_ VARCHAR(255), keywords_ VARCHAR(255))
RETURNS VARCHAR(255) DETERMINISTIC
BEGIN
	DECLARE schID INT;
	SELECT school_ID INTO schID FROM Book WHERE ID = bookID AND school_ID = schoolID;
	IF schID IS NULL THEN RETURN "NO BOOK";
	ELSE
		CREATE TEMPORARY TABLE delWriters(
			writerid INT PRIMARY KEY
		);
		INSERT INTO delWriters(writerid)
		SELECT DISTINCT writer_ID
		FROM writes
		WHERE book_ID = bookID;
    
		UPDATE Book
		SET publisher = publisher_, ISBN = ISBN_, page_number = page_number_, summary = summary_, copies = copies_, image = image_, lang = lang_, keywords = keywords_
		WHERE ID = bookID;
    
		DELETE FROM writes WHERE book_ID = bookID;
		DELETE FROM writer WHERE ID IN (SELECT writerid FROM delWriters WHERE writerid NOT IN (SELECT writer_ID FROM writes )); 
		DELETE FROM genre WHERE book_ID = bookID;
		RETURN "OK";
	END IF;
END //
DELIMITER ;

DELIMITER //
CREATE FUNCTION DelBook(bookID INT, userSchID INT)
RETURNS VARCHAR(255) DETERMINISTIC
BEGIN
	DECLARE schID INT;
	SELECT school_ID INTO schID FROM book WHERE ID = bookID AND school_ID = userSchID;
	IF schID IS NULL THEN RETURN "NO BOOK";
	ELSE 
		CREATE TEMPORARY TABLE delWriters(
			writerid INT PRIMARY KEY
		);
		INSERT INTO delWriters(writerid)
		SELECT DISTINCT writer_ID
		FROM writes
		WHERE book_ID = bookID;
    
		DELETE FROM writes WHERE book_ID = bookID;
		DELETE FROM writer WHERE ID IN (SELECT writerid FROM delWriters WHERE writerid NOT IN (SELECT writer_ID FROM writes )); 
		DELETE FROM reservation WHERE book_ID = bookID;
		DELETE FROM lending WHERE book_ID = bookID;
		DELETE FROM review WHERE book_ID = bookID;
		DELETE FROM genre WHERE book_ID = bookID;
		DELETE FROM book WHERE ID = bookID;
		RETURN "OK";
	END IF;
END //
DELIMITER ;

