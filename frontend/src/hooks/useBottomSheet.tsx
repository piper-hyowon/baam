import styled from "@emotion/native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Theme } from "../styles/theme";

interface BottomSheetComponentProps {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
}

const useBottomSheet = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sheetRef = useRef<BottomSheet>(null);

  const openSheet = useCallback(() => setIsVisible(true), []);
  const closeSheet = useCallback(() => setIsVisible(false), []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) setIsVisible(false);
  }, []);

  function BottomSheetComponent({ children, snapPoints = ["25%", "50%", "90%"] }: BottomSheetComponentProps) {
    useEffect(() => {
      if (isVisible) sheetRef.current?.expand();
    }, [isVisible]);

    return (
      <>
        {isVisible && <Overlay onTouchEnd={closeSheet} />}
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          index={isVisible ? 1 : -1}
          enablePanDownToClose={true}
          onChange={handleSheetChanges}
          handleComponent={() => (
            <CustomHandle>
              <Knob />
            </CustomHandle>
          )}
          backgroundStyle={bottomSheetBackground}
        >
          <BottomSheetScrollView contentContainerStyle={contentContainer} showsVerticalScrollIndicator={false}>
            {children}
          </BottomSheetScrollView>
        </BottomSheet>
      </>
    );
  }

  return {
    isVisible,
    openSheet,
    closeSheet,
    BottomSheetComponent
  };
};

const Overlay = styled.View({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)"
});

const CustomHandle = styled.View({
  width: "100%",
  paddingTop: 16,
  paddingBottom: 20,
  justifyContent: "center",
  alignItems: "center"
});

const Knob = styled.View({
  width: 80,
  height: 4,
  backgroundColor: Theme.colors.Black,
  borderRadius: 4
});

const bottomSheetBackground = {
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24
};

const contentContainer = {
  paddingHorizontal: 16,
  paddingBottom: 20
};

export default useBottomSheet;
