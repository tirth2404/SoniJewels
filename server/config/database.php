<?php

class Database {
    private $host = 'localhost';
    private $db_name = 'sonijewels';
    private $username = 'root';
    private $password = '';
    public $conn;

    public function getConnection(){
        $this->conn = null;

        try{
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8mb4");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }catch(PDOException $exception){
            error_log("Database connection error: " . $exception->getMessage(), 0);
            return null; // Return null on connection failure
        }

        return $this->conn;
    }
}
?>