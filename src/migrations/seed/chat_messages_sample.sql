-- Sample data for chat_messages (conversation_id = 1)
INSERT INTO chat_messages (id, conversation_id, sender_id, content, message_key)
VALUES
  (1, 1, 3, 'Tin nhắn 1', 'msg_1'),
  (2, 1, 4, 'Tin nhắn 2', 'msg_2'),
  (3, 1, 3, 'Tin nhắn 3', 'msg_3'),
  (4, 1, 4, 'Tin nhắn 4', 'msg_4'),
  (5, 1, 3, 'Tin nhắn 5', 'msg_5'),
  (6, 1, 4, 'Tin nhắn 6', 'msg_6'),
  (7, 1, 3, 'Tin nhắn 7', 'msg_7'),
  (8, 1, 4, 'Tin nhắn 8', 'msg_8'),
  (9, 1, 3, 'Tin nhắn 9', 'msg_9'),
  (10, 1, 4, 'Tin nhắn 10', 'msg_10'),
  (11, 1, 3, 'Tin nhắn 11', 'msg_11'),
  (12, 1, 4, 'Tin nhắn 12', 'msg_12'),
  (13, 1, 3, 'Tin nhắn 13', 'msg_13'),
  (14, 1, 4, 'Tin nhắn 14', 'msg_14'),
  (15, 1, 3, 'Tin nhắn 15', 'msg_15'),
  (16, 1, 4, 'Tin nhắn 16', 'msg_16'),
  (17, 1, 3, 'Tin nhắn 17', 'msg_17'),
  (18, 1, 4, 'Tin nhắn 18', 'msg_18'),
  (19, 1, 3, 'Tin nhắn 19', 'msg_19'),
  (20, 1, 4, 'Tin nhắn 20', 'msg_20'),
  (21, 1, 3, 'Tin nhắn 21', 'msg_21'),
  (22, 1, 4, 'Tin nhắn 22', 'msg_22'),
  (23, 1, 3, 'Tin nhắn 23', 'msg_23'),
  (24, 1, 4, 'Tin nhắn 24', 'msg_24'),
  (25, 1, 3, 'Tin nhắn 25', 'msg_25'),
  (26, 1, 4, 'Tin nhắn 26', 'msg_26'),
  (27, 1, 3, 'Tin nhắn 27', 'msg_27'),
  (28, 1, 4, 'Tin nhắn 28', 'msg_28'),
  (29, 1, 3, 'Tin nhắn 29', 'msg_29'),
  (30, 1, 4, 'Tin nhắn 30', 'msg_30');

SELECT setval('chat_messages_id_seq', (SELECT COALESCE(MAX(id), 1) FROM chat_messages));

