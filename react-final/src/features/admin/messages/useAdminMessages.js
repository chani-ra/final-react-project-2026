import { useEffect, useMemo, useState } from "react";
import useMessageNotice from "../../../components/ui/useMessageNotice";
import { getAdminSentMessages, getAllUsersForAdmin, sendAdminMessage } from "../../../services/adminService";
import { getRecipientsCounts, getRecipientOptions, getRecipientCount, validateAdminMessage } from "./adminMessagesModel.js";

const emptyForm = {
  targetType: "all",
  targetUser: "",
  title: "",
  body: "",
  priority: "normal",
};


export default function useAdminMessages() {
  const [users, setUsers] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  useMessageNotice(message);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    text: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const [usersData, messagesData] = await Promise.all([
        getAllUsersForAdmin(),
        getAdminSentMessages(),
      ]);

      setUsers(Array.isArray(usersData) ? usersData : []);
      setSentMessages(Array.isArray(messagesData) ? messagesData : []);
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const counts = useMemo(() => getRecipientsCounts(users), [users]);
  const singleUserOptions = useMemo(() => getRecipientOptions(users), [users]);
  const recipientCount = useMemo(() => getRecipientCount(form, counts), [form.targetType, form.targetUser, counts]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openSendConfirmModal = () => {
    const validationError = validateAdminMessage(form, recipientCount);

    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: "אישור שליחת הודעה",
      text: `ההודעה תישלח ל-${recipientCount} נמענים. להמשיך?`,
    });
  };

  const closeConfirmModal = () => {
    if (sending) return;

    setConfirmModal({
      isOpen: false,
      title: "",
      text: "",
    });
  };

  const handleSendMessage = async () => {
    try {
      setSending(true);
      setMessage({ type: "", text: "" });

      const payload = {
        title: form.title.trim(),
        body: form.body.trim(),
        targetType: form.targetType,
        targetUser: form.targetType === "single" ? form.targetUser : null,
        priority: form.priority,
        messageType: "announcement",
      };

      const response = await sendAdminMessage(payload);

      setMessage({
        type: "success",
        text: `ההודעה נשלחה בהצלחה ל-${response.count || recipientCount} נמענים`,
      });

      setForm(emptyForm);
      setConfirmModal({ isOpen: false, title: "", text: "" });

      await loadData();
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setSending(false);
    }
  };

  return { sentMessages, form, loading, sending, confirmModal, loadData, counts, singleUserOptions, recipientCount, updateField, openSendConfirmModal, closeConfirmModal, handleSendMessage };
}
