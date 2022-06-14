<?php
    include './api-login-check.php';
    include '../config-db.php';
    include '../config-path.php';

    $data = [
        'code' => 99,
        'message' => 'save error.'
    ];

    if (isset($_POST['id']) && isset($_POST['type']) && isset($_POST['data'])) {
        // 기존 정보 조회.
        try {
            $pdo = new PDO($DSN, $DB_USER_NAME, $DB_USER_PWD);
            $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $stmt = $pdo->prepare($SQL_SELECT_TB_TX_INFO);
            $stmt->execute([':SEQ_ID' => $_POST['id']]);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // 파일 생성.
            if (count($result) > 0) {
                $info = $result[0];
                $number = $info['USA_NUM'];
                $type = $_POST['type'];
                $protocol_group = json_decode($_POST['data']);
                $dir_path = $PROTOCOL_CONFIG_PATH;

                // 파일 경로 생성.
                if (!is_dir($dir_path)) {
                    mkdir($dir_path);
                }

                $file_path = null;

                if ($type == 'bluetooth') {
                    $file_path = $dir_path . '/' . $FREFIX_BLUETOOTH_NAME . $number . '.txt';

                } else {
                    $file_path = $dir_path . '/' . $FREFIX_SERIAL_NAME . $number . '.txt';
                }

                $handle = fopen($file_path, 'w');

                // 파일 작업.
                try {
                    // 소스 통일을 위해 작은따옴표 사용. 그로 인해 Chr(10)을 사용해 줄바꿈을 한다.

                    // 양방향 확인.
                    $is_one_way = null;

                    if ($type == 'bluetooth') {
                        $is_one_way = 'ONEWAY'; // 블루투스는 고정.

                    } else {
                        $is_one_way = ($protocol_group->isOneWay ? 'ONEWAY' : 'BIDIRECTIONAL');
                    }

                    fwrite($handle, $is_one_way . Chr(10));
                    fwrite($handle, Chr(10));

                    for ($i = 0; $i < count($protocol_group->array); $i++) {
                        $protocol = $protocol_group->array[$i];
                        $send = $protocol->send;
                        $recevie_arr = $protocol->recevieArray;

                        // 프로토콜 send.
                        $send_data_1 = null; // 시리얼 : Send type, 블루투스 : name
                        $send_data_2 = null; // 시리얼 : Send value, 블루투스 : NULL

                        if ($type == 'bluetooth') {
                            $send_data_1 = (empty($protocol->recevieName) ? 'NULL' : $protocol->recevieName);
                            $send_data_2 = 'NULL';

                        } else {
                            $send_data_1 = preg_replace('/\s+/', '', (empty($send->type) ? 'NULL' : $send->type));
                            $send_data_2 = preg_replace('/\s+/', '', (empty($send->value) ? 'NULL' : $send->value));
                        }

                        fwrite($handle, sprintf('SEND %s %s', $send_data_1, $send_data_2) . Chr(10));

                        // 프로토콜 recevie.
                        for ($j = 0; $j < count($recevie_arr); $j++) {
                            $recevie = $recevie_arr[$j];

                            $recevie_name = preg_replace('/\s+/', '', (empty($recevie->name) ? 'NULL' : $recevie->name));
                            $recevie_type = preg_replace('/\s+/', '', (empty($recevie->type) ? 'NULL' : $recevie->type));
                            $recevie_start = $recevie->start < 0 ? 0 : $recevie->start;
                            $recevie_length = $recevie->length < 0 ? 0 : $recevie->length;

                            fwrite($handle, sprintf('%s %s %s %s', $recevie_name, $recevie_type, $recevie_start, $recevie_length) . Chr(10));
                        }

                        // END.
                        fwrite($handle, 'END' . Chr(10));
                        fwrite($handle, Chr(10));
                    }

                } catch (Exception $e) {
                    $data['message'] = $e->getMessage();

                } finally {
                    fclose($handle);
                }
                // END-파일 작업.
            }

            $data['code'] = 0;
            $data['message'] = 'ok';
            // END-파일 생성.

        } catch (Exception $e) {
            $data['message'] = $e->getMessage();
        }
        // END-기존 정보 조회.
    }

    echo json_encode($data, JSON_NUMERIC_CHECK);
?>