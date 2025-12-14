import React from 'react';
import { Modal, View, Text, Pressable, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { X } from 'lucide-react-native';

interface FormModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export const FormModal: React.FC<FormModalProps> = ({
    visible,
    onClose,
    title,
    children,
    footer
}) => {
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end">
                {/* Backdrop - Dismises Keyboard and Closes Modal */}
                <TouchableWithoutFeedback onPress={() => {
                    Keyboard.dismiss();
                    onClose();
                }}>
                    <View className="absolute inset-0 bg-black/80" />
                </TouchableWithoutFeedback>

                {/* Modal Container */}
                <View className="bg-[#1a1a1a] rounded-t-3xl w-full border-t border-white/10 relative z-10 overflow-hidden flex-col max-h-[85%]">
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-6 py-5 border-b border-white/5 bg-[#1a1a1a]">
                        <Text className="text-white text-lg font-bold">{title}</Text>
                        <Pressable onPress={onClose} className="p-1 bg-white/5 rounded-full">
                            <X size={24} color="#FFF" />
                        </Pressable>
                    </View>

                    {/* Scrollable Content with Keyboard Awareness */}
                    <KeyboardAwareScrollView
                        enableOnAndroid={true}
                        enableAutomaticScroll={true}
                        extraHeight={150}
                        extraScrollHeight={150}
                        keyboardOpeningTime={250}
                        viewIsInsideTabBar={true}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Inner Container to ensure padding */}
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View className="p-6 pb-10">
                                {children}
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAwareScrollView>

                    {/* Footer */}
                    {footer && (
                        <View className="p-6 bg-[#1a1a1a] border-t border-white/5">
                            {footer}
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};
