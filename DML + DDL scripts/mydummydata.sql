USE persefoniDB;

INSERT INTO `School` (`school_name`, `address`, `city`, `phone`, `email`, `principal`) 
VALUES ('School 1', '173 Marcelina Brooks Apt. 914\nGeneville, WI 34212', 'Athens', '1-554-212-9610', 'gislason.carlo@example.net', 'Prof. Charlie Wolff');
INSERT INTO `School` (`school_name`, `address`, `city`, `phone`, `email`, `principal`) 
VALUES ('School 2', '5895 Gerlach Walks Apt. 705\nSouth D\'angelo, ME 44771', 'Thessaloniki', '1-866-563-7370x2346', 'ernestina.dubuque@example.net', 'Armando Barrows II');
INSERT INTO `School` (`school_name`, `address`, `city`, `phone`, `email`, `principal`) 
VALUES ('School 3', '12517 Berge Shore\nEast Jeff, MD 78021-2374', 'Crete', '1-087-243-6008', 'filomena.gibson@example.org', 'Wilfredo Kohler');

INSERT INTO `Book` (`title`, `publisher`, `ISBN`, `page_number`, `summary`, `copies`, `image`, `lang`, `keywords`, `school_ID`) 
VALUES ('Book 1', 'Efrain', 'e5e79a46-61a7-3a1c-9648-20f3f71945e7', 1300, 'Natus sunt qui et iure. Eaque voluptate perspiciatis voluptatem. Accusamus perferendis similique optio fugit quas rerum. Rerum ipsam ut reiciendis nulla illum quos ex.', 5, 'tmp//0a1b1e5e8acaa3c2664ba84421da921f.jpg', 'Greek', '[one, two, three]', 1);
INSERT INTO `Book` (`title`, `publisher`, `ISBN`, `page_number`, `summary`, `copies`, `image`, `lang`, `keywords`, `school_ID`) 
VALUES ('Book 2', 'Efrain', 'e5e79a46-61a7-3a1c-9648-20f3f71945e7', 60, 'Natus sunt qui et iure. Eaque voluptate perspiciatis voluptatem. Accusamus perferendis similique optio fugit quas rerum. Rerum ipsam ut reiciendis nulla illum quos ex.', 10, 'tmp//0a1b1e5e8acaa3c2664ba84421da921f.jpg', 'Greek', '[one, two, three]', 1);
INSERT INTO `Book` (`title`, `publisher`, `ISBN`, `page_number`, `summary`, `copies`, `image`, `lang`, `keywords`, `school_ID`) 
VALUES ('Book 3', 'Efrain', 'e5e79a46-61a7-3a1c-9648-20f3f71945e7', 130, 'Natus sunt qui et iure. Eaque voluptate perspiciatis voluptatem. Accusamus perferendis similique optio fugit quas rerum. Rerum ipsam ut reiciendis nulla illum quos ex.', 1, 'tmp//0a1b1e5e8acaa3c2664ba84421da921f.jpg', 'Greek', '[one, two, three]', 2);
INSERT INTO `Book` (`title`, `publisher`, `ISBN`, `page_number`, `summary`, `copies`, `image`, `lang`, `keywords`, `school_ID`) 
VALUES ('Book 4', 'Efrain', 'e5e79a46-61a7-3a1c-9648-20f3f71945e7', 100, 'Natus sunt qui et iure. Eaque voluptate perspiciatis voluptatem. Accusamus perferendis similique optio fugit quas rerum. Rerum ipsam ut reiciendis nulla illum quos ex.', 1, 'tmp//0a1b1e5e8acaa3c2664ba84421da921f.jpg', 'Greek', '[one, two, three]', 1);
INSERT INTO `Book` (`title`, `publisher`, `ISBN`, `page_number`, `summary`, `copies`, `image`, `lang`, `keywords`, `school_ID`) 
VALUES ('Book 5', 'Efrain', 'e5e79a46-61a7-3a1c-9648-20f3f71945e7', 800, 'Natus sunt qui et iure. Eaque voluptate perspiciatis voluptatem. Accusamus perferendis similique optio fugit quas rerum. Rerum ipsam ut reiciendis nulla illum quos ex.', 18, 'tmp//0a1b1e5e8acaa3c2664ba84421da921f.jpg', 'Greek', '[one, two, three]', 3);
INSERT INTO `Book` (`title`, `publisher`, `ISBN`, `page_number`, `summary`, `copies`, `image`, `lang`, `keywords`, `school_ID`) 
VALUES ('Book 6', 'Efrain', 'e5e79a46-61a7-3a1c-9648-20f3f71945e7', 80, 'Natus sunt qui et iure. Eaque voluptate perspiciatis voluptatem. Accusamus perferendis similique optio fugit quas rerum. Rerum ipsam ut reiciendis nulla illum quos ex.', 7, 'tmp//0a1b1e5e8acaa3c2664ba84421da921f.jpg', 'Greek', '[one, two, three]', 2);
INSERT INTO `Book` (`title`, `publisher`, `ISBN`, `page_number`, `summary`, `copies`, `image`, `lang`, `keywords`, `school_ID`) 
VALUES ('Book 7', 'Efrain', 'e5e79a46-61a7-3a1c-9648-20f3f71945e7', 170, 'Natus sunt qui et iure. Eaque voluptate perspiciatis voluptatem. Accusamus perferendis similique optio fugit quas rerum. Rerum ipsam ut reiciendis nulla illum quos ex.', 1, 'tmp//0a1b1e5e8acaa3c2664ba84421da921f.jpg', 'Greek', '[one, two, three]', 1);
INSERT INTO `Book` (`title`, `publisher`, `ISBN`, `page_number`, `summary`, `copies`, `image`, `lang`, `keywords`, `school_ID`) 
VALUES ('Book 8', 'Efrain', 'e5e79a46-61a7-3a1c-9648-20f3f71945e7', 100, 'Natus sunt qui et iure. Eaque voluptate perspiciatis voluptatem. Accusamus perferendis similique optio fugit quas rerum. Rerum ipsam ut reiciendis nulla illum quos ex.', 3, 'tmp//0a1b1e5e8acaa3c2664ba84421da921f.jpg', 'Greek', '[one, two, three]', 2);

INSERT INTO `Genre` (`book_ID`, `genre`) VALUES (1, 'horror');
INSERT INTO `Genre` (`book_ID`, `genre`) VALUES (7, 'horror');
INSERT INTO `Genre` (`book_ID`, `genre`) VALUES (2, 'horror');
INSERT INTO `Genre` (`book_ID`, `genre`) VALUES (1, 'adventure');
INSERT INTO `Genre` (`book_ID`, `genre`) VALUES (3, 'horror');
INSERT INTO `Genre` (`book_ID`, `genre`) VALUES (4, 'adventure');
INSERT INTO `Genre` (`book_ID`, `genre`) VALUES (5, 'romance');
INSERT INTO `Genre` (`book_ID`, `genre`) VALUES (6, 'horror');
INSERT INTO `Genre` (`book_ID`, `genre`) VALUES (7, 'kpop');
INSERT INTO `Genre` (`book_ID`, `genre`) VALUES (8, 'romance');
INSERT INTO `Genre` (`book_ID`, `genre`) VALUES (4, 'romance');
INSERT INTO `Genre` (`book_ID`, `genre`) VALUES (6, 'poetry');
INSERT INTO `Genre` (`book_ID`, `genre`) VALUES (2, 'poetry');

INSERT INTO `Writer` (`first_name`, `last_name`) VALUES ('Anibal', 'Daugherty');
INSERT INTO `Writer` (`first_name`, `last_name`) VALUES ('Claudie', 'Hickle');
INSERT INTO `Writer` (`first_name`, `last_name`) VALUES ('Adrain', 'Ruecker');
INSERT INTO `Writer` (`first_name`, `last_name`) VALUES ('Gavin', 'Crona');
INSERT INTO `Writer` (`first_name`, `last_name`) VALUES ('Burnice', 'Swift');
INSERT INTO `Writer` (`first_name`, `last_name`) VALUES ('Jeremy', 'Ebert');
INSERT INTO `Writer` (`first_name`, `last_name`) VALUES ('Kira', 'Hintz');
INSERT INTO `Writer` (`first_name`, `last_name`) VALUES ('Vivienne', 'McKenzie');
INSERT INTO `Writer` (`first_name`, `last_name`) VALUES ('Estrella', 'Sauer');
INSERT INTO `Writer` (`first_name`, `last_name`) VALUES ('Jacinto', 'Lowe');
INSERT INTO `Writer` (`first_name`, `last_name`) VALUES ('Hans', 'Johns');

INSERT INTO `Writes` (`writer_ID`, `book_ID`) VALUES (1, 1);
INSERT INTO `Writes` (`writer_ID`, `book_ID`) VALUES (11, 2);
INSERT INTO `Writes` (`writer_ID`, `book_ID`) VALUES (2, 3);
INSERT INTO `Writes` (`writer_ID`, `book_ID`) VALUES (4, 4);
INSERT INTO `Writes` (`writer_ID`, `book_ID`) VALUES (10, 5);
INSERT INTO `Writes` (`writer_ID`, `book_ID`) VALUES (8, 6);
INSERT INTO `Writes` (`writer_ID`, `book_ID`) VALUES (9, 7);
INSERT INTO `Writes` (`writer_ID`, `book_ID`) VALUES (1, 8);
INSERT INTO `Writes` (`writer_ID`, `book_ID`) VALUES (7, 1);
INSERT INTO `Writes` (`writer_ID`, `book_ID`) VALUES (3, 2);
INSERT INTO `Writes` (`writer_ID`, `book_ID`) VALUES (1, 3);
INSERT INTO `Writes` (`writer_ID`, `book_ID`) VALUES (5, 4);
INSERT INTO `Writes` (`writer_ID`, `book_ID`) VALUES (6, 5);
INSERT INTO `Writes` (`writer_ID`, `book_ID`) VALUES (2, 6);
INSERT INTO `Writes` (`writer_ID`, `book_ID`) VALUES (1, 7);
INSERT INTO `Writes` (`writer_ID`, `book_ID`) VALUES (10, 8);
INSERT INTO `Writes` (`writer_ID`, `book_ID`) VALUES (2, 1);
INSERT INTO `Writes` (`writer_ID`, `book_ID`) VALUES (1, 2);

INSERT INTO `Users` (`username`, `user_password`, `user_role`, `first_name`, `last_name`, `birth_date`, `school_ID`) VALUES ('superadmin42', 'test1234', 'super-admin', 'Ciara', 'Kulas', '2001-08-10 00:00:00', null);
INSERT INTO `Users` (`username`, `user_password`, `user_role`, `first_name`, `last_name`, `birth_date`, `school_ID`) VALUES ('school1admin', 'test1234', 'school-admin', 'Ciara', 'Kulas', '2001-08-10 00:00:00', 1);
INSERT INTO `Users` (`username`, `user_password`, `user_role`, `first_name`, `last_name`, `birth_date`, `school_ID`) VALUES ('school2admin', 'test1234', 'school-admin', 'Ciara', 'Kulas', '2001-08-10 00:00:00', 2);
INSERT INTO `Users` (`username`, `user_password`, `user_role`, `first_name`, `last_name`, `birth_date`, `school_ID`) VALUES ('school3admin', 'test1234', 'school-admin', 'Ciara', 'Kulas', '2001-08-10 00:00:00', 3);
INSERT INTO `Users` (`username`, `user_password`, `user_role`, `first_name`, `last_name`, `birth_date`, `school_ID`) VALUES ('teacher2', 'test1234', 'teacher', 'Ciara', 'Kulas', '2001-08-10 00:00:00', 1);
INSERT INTO `Users` (`username`, `user_password`, `user_role`, `first_name`, `last_name`, `birth_date`, `school_ID`) VALUES ('teacher3', 'test1234', 'teacher', 'Ciara', 'Kulas', '2001-08-10 00:00:00', 2);
INSERT INTO `Users` (`username`, `user_password`, `user_role`, `first_name`, `last_name`, `birth_date`, `school_ID`) VALUES ('teacher4', 'test1234', 'teacher', 'Ciara', 'Kulas', '2001-08-10 00:00:00', 3);
INSERT INTO `Users` (`username`, `user_password`, `user_role`, `first_name`, `last_name`, `birth_date`, `school_ID`) VALUES ('student1', 'test1234', 'student', 'Ciara', 'Kulas', '2001-08-10 00:00:00', 1);
INSERT INTO `Users` (`username`, `user_password`, `user_role`, `first_name`, `last_name`, `birth_date`, `school_ID`) VALUES ('student2', 'test1234', 'student', 'Ciara', 'Kulas', '2001-08-10 00:00:00', 2);
INSERT INTO `Users` (`username`, `user_password`, `user_role`, `first_name`, `last_name`, `birth_date`, `school_ID`) VALUES ('student3', 'test1234', 'student', 'Ciara', 'Kulas', '2001-08-10 00:00:00', 3);

INSERT INTO `Reservation` (`user_ID`, `book_ID`) VALUES (5, 1);
INSERT INTO `Reservation` (`user_ID`, `book_ID`) VALUES (6, 1);
INSERT INTO `Reservation` (`user_ID`, `book_ID`) VALUES (7, 5);
INSERT INTO `Reservation` (`user_ID`, `book_ID`) VALUES (8, 4);
INSERT INTO `Reservation` (`user_ID`, `book_ID`) VALUES (9, 1);
INSERT INTO `Reservation` (`user_ID`, `book_ID`) VALUES (10, 2);
INSERT INTO `Reservation` (`user_ID`, `book_ID`) VALUES (5, 7);
INSERT INTO `Reservation` (`user_ID`, `book_ID`) VALUES (6, 8);
INSERT INTO `Reservation` (`user_ID`, `book_ID`) VALUES (7, 6);
INSERT INTO `Reservation` (`user_ID`, `book_ID`) VALUES (8, 6);
INSERT INTO `Reservation` (`user_ID`, `book_ID`) VALUES (9, 4);
INSERT INTO `Reservation` (`user_ID`, `book_ID`) VALUES (10, 3);
INSERT INTO `Reservation` (`user_ID`, `book_ID`) VALUES (5, 2);

INSERT INTO `Lending` (`user_ID`, `book_ID`) VALUES (5, 1);
INSERT INTO `Lending` (`user_ID`, `book_ID`) VALUES (6, 2);
INSERT INTO `Lending` (`user_ID`, `book_ID`) VALUES (7, 3);
INSERT INTO `Lending` (`user_ID`, `book_ID`) VALUES (8, 4);
INSERT INTO `Lending` (`user_ID`, `book_ID`) VALUES (9, 5);
INSERT INTO `Lending` (`user_ID`, `book_ID`) VALUES (10, 6);
INSERT INTO `Lending` (`user_ID`, `book_ID`) VALUES (5, 7);
INSERT INTO `Lending` (`user_ID`, `book_ID`) VALUES (6, 8);
INSERT INTO `Lending` (`user_ID`, `book_ID`) VALUES (7, 6);
INSERT INTO `Lending` (`user_ID`, `book_ID`) VALUES (8, 5);
INSERT INTO `Lending` (`user_ID`, `book_ID`) VALUES (9, 8);

INSERT INTO `Review` (`user_ID`, `book_ID`, `review`, `rating`) VALUES (5, 1, 'Dolorum laborum quibusdam quos sed. Impedit et est incidunt itaque. Earum earum possimus debitis animi autem laborum. Atque eius et sapiente omnis iste et.', 4.0);
INSERT INTO `Review` (`user_ID`, `book_ID`, `review`, `rating`) VALUES (6, 2, 'Dolorum laborum quibusdam quos sed. Impedit et est incidunt itaque. Earum earum possimus debitis animi autem laborum. Atque eius et sapiente omnis iste et.', 4.5);
INSERT INTO `Review` (`user_ID`, `book_ID`, `review`, `rating`) VALUES (7, 3, 'Dolorum laborum quibusdam quos sed. Impedit et est incidunt itaque. Earum earum possimus debitis animi autem laborum. Atque eius et sapiente omnis iste et.', 3.5);
INSERT INTO `Review` (`user_ID`, `book_ID`, `review`, `rating`) VALUES (8, 4, 'Dolorum laborum quibusdam quos sed. Impedit et est incidunt itaque. Earum earum possimus debitis animi autem laborum. Atque eius et sapiente omnis iste et.', 3.0);
INSERT INTO `Review` (`user_ID`, `book_ID`, `review`, `rating`) VALUES (9, 4, 'Dolorum laborum quibusdam quos sed. Impedit et est incidunt itaque. Earum earum possimus debitis animi autem laborum. Atque eius et sapiente omnis iste et.', 4.2);
INSERT INTO `Review` (`user_ID`, `book_ID`, `review`, `rating`) VALUES (10, 8, 'Dolorum laborum quibusdam quos sed. Impedit et est incidunt itaque. Earum earum possimus debitis animi autem laborum. Atque eius et sapiente omnis iste et.', 5.0);
INSERT INTO `Review` (`user_ID`, `book_ID`, `review`, `rating`) VALUES (10, 7, 'Dolorum laborum quibusdam quos sed. Impedit et est incidunt itaque. Earum earum possimus debitis animi autem laborum. Atque eius et sapiente omnis iste et.', 1.5);



