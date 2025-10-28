import { Modal,Button } from "react-bootstrap";

const RemoveItemModal = ({show,onClose,onConfirm,item}) => {
    if(!item) return null;

    return(
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Removal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to remove{" "}
        <strong>{item.title}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => onConfirm(item)}>
          Remove
        </Button>
      </Modal.Footer>
    </Modal>
    );
};

export default RemoveItemModal;