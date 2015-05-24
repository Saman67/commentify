<?php

require '../Slim/Slim.php';
\Slim\Slim::registerAutoloader();


class API
{
    private static $api;
    private static $servername = "localhost";
    private static $username = "root";
    private static $password = "password";
    private static $dbname = "commentify";
    private static $conn;

    public static function run() {
        self::$api = new \Slim\Slim();
        self::$conn = new mysqli(self::$servername, self::$username, self::$password, self::$dbname);

        self::$api->get('/', function () {
            echo "API is running!";
        });


        // GET Comment
        self::$api->get('/get-comments', function () {

            $count = self::$api->request->get('count');
            if($count === null || !is_numeric($count))
                $count = 50;

            $from = self::$api->request->get('from');
            if($from === null || !is_numeric($from))
                $from = 0;

            $sql = "SELECT * FROM comments ORDER BY id DESC LIMIT " . $count . " OFFSET " . $from;

            $result = self::$conn->query($sql);

            $rows = array();
            while ($r = mysqli_fetch_assoc($result)) {
                $rows[] = $r;
            }
            echo json_encode($rows);
            self::$conn->close();
        });


        // POST Comment
        self::$api->post('/add-comment', function () {
            $name = self::$api->request->post('name');
            $comment = self::$api->request->post('comment');
            $email = self::$api->request->post('email');
            if ($name !== null && $comment !== null) {
                $sql = "INSERT INTO comments (name, comment, email, submitdate)
                          VALUES ('" . $name . "', '" . $comment . "', '" . $email . "', NOW())";
                if (self::$conn->query($sql) === TRUE)
                    echo json_encode(array("status" => "success"));
                else
                    echo json_encode(array("error" => self::$conn->error));
                self::$conn->close();
            }
            else
            {
                echo json_encode(array("error" => 'Invalid parameters!'));
            }
        });

        self::$api->run();
    }
}

API::run();