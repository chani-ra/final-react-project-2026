import { useEffect, useRef, useState } from "react";
import useMessageNotice from "../../../components/ui/useMessageNotice.js";
import { useNotices } from "../../../components/ui/NoticeProvider";
import { libraryApi } from "../library/libraryApi";
import {
  EMPTY_LIBRARY,
  TYPE_LABELS,
  UPDATE_MESSAGES,
  buildUpdatePayload,
  getEditForm,
  getLibraryView,
} from "../library/libraryModel";
import { getEmptyEditForm } from "../components/library/libraryUtils";

const NO_MESSAGE = { type: "", text: "" };

export default function useTeacherLibrary(teacherId) {
  const notices = useNotices();
  const [activeTab, setActiveTab] = useState("lessons");
  const [collections, setCollections] = useState(EMPTY_LIBRARY);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [message, setMessage] = useState(NO_MESSAGE);
  useMessageNotice(message);
  const [editingItem, setEditingItem] = useState(null);
  const [editType, setEditType] = useState("");
  const [editForm, setEditForm] = useState(getEmptyEditForm);
  const actionRunning = useRef(false);

  useEffect(() => {
    let cancelled = false;

    if (!teacherId) {
      setMessage({
        type: "error",
        text: "לא נמצא מזהה מורה. נסי להתחבר מחדש.",
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    setMessage(NO_MESSAGE);
    libraryApi.loadAll(teacherId)
      .then((result) => {
        if (!cancelled) setCollections(result);
      })
      .catch((error) => {
        if (!cancelled) {
          setMessage({ type: "error", text: error.toString() });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [teacherId]);

  const updateCollection = (type, updater) => {
    const collection = libraryApi.collectionFor(type);
    setCollections((previous) => ({
      ...previous,
      [collection]: updater(previous[collection] || []),
    }));
  };

  const performAction = async (id, action) => {
    if (actionRunning.current) return;
    actionRunning.current = true;
    setActionLoadingId(id);
    setMessage(NO_MESSAGE);

    try {
      await action();
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setActionLoadingId("");
      actionRunning.current = false;
    }
  };

  const handleDelete = async (item, type) => {
    if (!item?._id || !TYPE_LABELS[type]) return;
    const accepted = await notices.confirm({
      title: `למחוק ${TYPE_LABELS[type]}?`,
      message: "לא ניתן לשחזר פריט שנמחק.",
      confirmText: "כן, למחוק",
      danger: true,
    });
    if (!accepted) return;

    await performAction(item._id, async () => {
      await libraryApi.remove(type, item._id);
      updateCollection(type, (items) =>
        items.filter((entry) => entry._id !== item._id)
      );
      setMessage({
        type: "success",
        text: `${TYPE_LABELS[type]} נמחק בהצלחה.`,
      });
    });
  };

  const handleTogglePublish = async (item, type) => {
    if (!item?._id || !TYPE_LABELS[type]) return;

    await performAction(item._id, async () => {
      const requestedStatus = !item.isPublic;
      const isPublic = await libraryApi.publish(
        type,
        item._id,
        requestedStatus
      );
      updateCollection(type, (items) =>
        items.map((entry) =>
          entry._id === item._id ? { ...entry, isPublic } : entry
        )
      );
      setMessage({
        type: "success",
        text: requestedStatus
          ? "התוכן פורסם ויכול להיכנס למסלולים אישיים."
          : "התוכן הוחזר לטיוטה.",
      });
    });
  };

  const openEditModal = (item, type) => {
    if (!item?._id || !TYPE_LABELS[type] || actionRunning.current) return;
    setEditingItem(item);
    setEditType(type);
    setEditForm(getEditForm(item, type));
  };

  const closeEditModal = () => {
    if (actionRunning.current) return;
    setEditingItem(null);
    setEditType("");
    setEditForm(getEmptyEditForm());
  };

  const handleSaveEdit = async () => {
    if (!editingItem?._id || !TYPE_LABELS[editType]) return;
    const id = editingItem._id;
    const type = editType;

    await performAction(id, async () => {
      const payload = buildUpdatePayload(type, editForm);
      const updated = await libraryApi.save(type, id, payload);
      updateCollection(type, (items) =>
        items.map((item) =>
          item._id === id ? { ...item, ...updated } : item
        )
      );
      setMessage({ type: "success", text: UPDATE_MESSAGES[type] });
      setEditingItem(null);
      setEditType("");
      setEditForm(getEmptyEditForm());
    });
  };

  const view = getLibraryView(collections, activeTab);

  return {
    ...collections,
    ...view,
    activeTab,
    setActiveTab,
    loading,
    actionLoadingId,
    message,
    editingItem,
    editType,
    editForm,
    setEditForm,
    handleDelete,
    handleTogglePublish,
    openEditModal,
    closeEditModal,
    handleSaveEdit,
  };
}
