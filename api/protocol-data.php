<?php
    include './api-login-check.php';
    include '../config-db.php';
    include '../config-path.php';

    $data = [
        'code' => 99,
        'message' => 'data not found.'
    ];

    if (isset($_GET['id']) && isset($_GET['type'])) {
        // 기존 정보 조회.
        try {
            $pdo = new PDO($DSN, $DB_USER_NAME, $DB_USER_PWD);
            $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $stmt = $pdo->prepare($SQL_SELECT_TB_TX_INFO);
            $stmt->execute([':SEQ_ID' => $_GET['id']]);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // 파일 읽기.
            if (count($result) > 0) {
                $info = $result[0];
                $number = $info['USA_NUM'];
                $type = $_GET['type'];
                $file_path = null;

                if ($type == 'bluetooth') {
                    $file_path = $PROTOCOL_CONFIG_PATH . '/' . $FREFIX_BLUETOOTH_NAME . $number . '.txt';

                } else {
                    $file_path = $PROTOCOL_CONFIG_PATH . '/' . $FREFIX_SERIAL_NAME . $number . '.txt';
                }

                $handle = fopen($file_path, 'r');

                // 파일 작업.
                try {
                    if ($handle) {
                        $count = 0;
                        $is_one_way = true;
                        $protocol_arr = [];
                        $protocol = null;

                        while(($line = fgets($handle)) !== false) {
                            $str = trim($line);

                            if ($str) {
                                // 양방향 확인.
                                if ($count == 0 && strpos($str, 'BIDIRECTIONAL') === 0) {
                                    $is_one_way = false;

                                // 프로토콜 send (DATA START).
                                } else if (strpos($str, 'SEND') === 0) {
                                    $send_data_arr = explode(' ', $str);
                                    $send_data_1 = null; // 시리얼 : Send type, 블루투스 : name
                                    $send_data_2 = null; // 시리얼 : Send value, 블루투스 : NULL

                                    if ($type == 'bluetooth') {
                                        $send_data_1 = '';

                                        for ($i = 0; $i < count($send_data_arr); $i++) {
                                            if ($i > 0 && $i < count($send_data_arr) - 1) {
                                                $val = $send_data_arr[$i];
                                                $send_data_1 .= ' ' . ($val != 'NULL' ? $val : '');
                                            }
                                        }

                                        $send_data_1 = trim($send_data_1);

                                        $protocol = [
                                            'send' => [
                                                'type' => '',
                                                'value' => ''
                                            ],
                                            'recevieName' => $send_data_1,
                                            'recevieArray' => []
                                        ];
                                    } else {
                                        $send_data_1 = $send_data_arr[1] && ($send_data_arr[1] != 'NULL') ? $send_data_arr[1] : ''; // 시리얼 : Send type, 블루투스 : name
                                        $send_data_2 = $send_data_arr[2] && ($send_data_arr[2] != 'NULL') ? $send_data_arr[2] : ''; // 시리얼 : Send value, 블루투스 : NULL

                                        $protocol = [
                                            'send' => [
                                                'type' => $send_data_1,
                                                'value' => $send_data_2
                                            ],
                                            'recevieArray' => []
                                        ];
                                    }

                                // DATA END.
                                } else if (strpos($str, 'END') === 0) {
                                    $protocol_arr[] = $protocol;

                                // 프로토콜 recevie.
                                } else {
                                    $recevie = explode(' ', $str);

                                    $protocol['recevieArray'][] = [
                                        'name' => ($recevie[0] && $recevie[0] != 'NULL') ? $recevie[0] : '',
                                        'type' => ($recevie[1] && $recevie[1] != 'NULL') ? $recevie[1] : '',
                                        'start' => ($recevie[2] && $recevie[2] != 'NULL') ? $recevie[2] : '',
                                        'length' => ($recevie[3] && $recevie[3] != 'NULL') ? $recevie[3] : ''
                                    ];
                                }
                            }

                            $count++;
                        }

                        $group = [
                            'isOneWay' => $is_one_way,
                            'array' => $protocol_arr
                        ];

                        $data['data'] = $group;

                    } else {
                        // 파일이 없는 경우.
                        $data['data'] = new stdClass();
                    }

                    $data['code'] = 0;
                    $data['message'] = 'ok';

                } catch (Exception $e) {
                    $data['message'] = $e->getMessage();

                } finally {
                    fclose($handle);
                }
                // END-파일 작업.
            }
            // END-파일 읽기.
        } catch (Exception $e) {
            $data['message'] = $e->getMessage();
        }
        // END-기존 정보 조회.
    }

    echo json_encode($data, JSON_NUMERIC_CHECK|JSON_UNESCAPED_UNICODE);
?>