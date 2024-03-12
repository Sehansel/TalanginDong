import React from 'react';
import {View, Text, TouchableOpacity, Modal, TextInput} from 'react-native';

interface EditModalProps {
  isVisible: boolean;
  item: {item: string; price: number};
  onSave: (updatedItem: {item: string; price: number}) => void;
  onCancel: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
  isVisible,
  item,
  onSave,
  onCancel,
}) => {
  // State to hold the updated item
  const [updatedItem, setUpdatedItem] = React.useState({
    item: item.item,
    price: item.price,
  });

  // Function to handle changes to the item
  const handleChange = (
    field: keyof typeof updatedItem,
    value: string | number,
  ) => {
    setUpdatedItem(prevState => ({...prevState, [field]: value}));
  };

  // Function to save the updated item
  const handleSave = () => {
    onSave(updatedItem);
    onCancel();
  };

  return (
    <Modal visible={isVisible} animationType="slide">
      <View>
        <Text>Edit Item</Text>
        <Text>Item: {item.item}</Text>
        <Text>Price: {item.price}</Text>
        <TextInput
          value={updatedItem.item}
          onChangeText={value => handleChange('item', value)}
          placeholder="Enter item name"
        />
        <TextInput
          value={String(updatedItem.price)}
          onChangeText={value => handleChange('price', parseFloat(value))}
          placeholder="Enter item price"
          keyboardType="numeric"
        />
        <TouchableOpacity onPress={handleSave}>
          <Text>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default EditModal;
