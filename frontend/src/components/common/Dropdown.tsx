import React, { useState, useEffect } from "react";
import { Platform, View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Image } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import DropDownPicker from "react-native-dropdown-picker";
import styled from "@emotion/native";
import { IconPlus, DropDownDown } from "../../assets/assets";
// const { height } = Dimensions.get("window");

interface DropDownProps {
  items: { label: string; value: string }[];
  onPlus: () => void;
}

function DropDown({ items, onPlus, ...props }: DropDownProps) {
  const [value, setValue] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleValueChange = (itemValue: string) => {
    setValue(itemValue);
  };

  return (
    <DropdownContainer>
      {Platform.OS === "ios" ? (
        <RNPickerSelect
          onValueChange={handleValueChange}
          items={items}
          style={{
            inputIOS: {
              fontSize: 16,
              paddingVertical: 12,
              paddingHorizontal: 10,
              borderWidth: 1,
              borderColor: "#9747FF",
              borderRadius: 12,
              color: "black",
              paddingRight: 30,
              backgroundColor: "white",
              width: "100%"
            },
            viewContainer: {
              width: "100%"
            },
            iconContainer: {
              top: 10,
              right: 12
            }
          }}
          useNativeAndroidPickerStyle={false}
          Icon={() => {
            return <DropdownIcon source={DropDownDown} />;
          }}
        />
      ) : (
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={() => {}}
          style={{
            borderColor: "#9747FF",
            borderWidth: 1,
            borderRadius: 12
          }}
          dropDownContainerStyle={{
            borderColor: "#9747FF"
          }}
        />
      )}
      <TouchableOpacity
        style={{
          width: "10%",
          marginLeft: 10,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <PlusIcon source={IconPlus} />
      </TouchableOpacity>
    </DropdownContainer>
  );
}

export default DropDown;

const DropdownContainer = styled.View`
  width: 90%;
  padding: 16px;
  display: flex;
  flex-direction: row;
`;

const DropdownIcon = styled.Image`
  width: 24px;
  height: 24px;
  transform: rotate(180deg);
  align-items: center;
  justify-content: center;
`;
const PlusIcon = styled.Image`
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
`;
