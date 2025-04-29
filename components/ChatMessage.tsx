import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from './Text';
import { formatMessageTime } from '@/utils/helpers';
import { borderRadius, colors, spacing, typography } from '@/utils/theme';

interface ChatMessageProps {
  text: string;
  timestamp: string;
  isSender: boolean;
}

export default function ChatMessage({ text, timestamp, isSender }: ChatMessageProps) {
  return (
    <View style={[styles.container, isSender ? styles.senderContainer : null]}>
      <View 
        style={[
          styles.bubble, 
          isSender ? styles.senderBubble : styles.receiverBubble
        ]}
      >
        <Text style={[
             styles.text, 
            isSender ? styles.senderText : styles.receiverText
          ]}
        >
          {text}
        </Text>
        <Text 
          variant="caption" 
          style={[
            styles.time, 
            isSender ? styles.senderTime : styles.receiverTime
          ]}
        >
          {formatMessageTime(timestamp)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: spacing.xs,
    maxWidth: '80%',
  },
  senderContainer: {
    alignSelf: 'flex-end',
  },
  bubble: {
    padding: spacing.s,
    borderRadius: borderRadius.l,
    minWidth: 60,
  },
  senderBubble: {
    backgroundColor: colors.primary[500],
    borderBottomRightRadius: 4,
  },
  receiverBubble: {
    backgroundColor: colors.neutral[100],
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: typography.sizes.m,
    marginBottom: spacing.xs,
  },
  senderText: {
    color: colors.white,
  },
  receiverText: {
    color: colors.neutral[800],
  },
  time: {
    fontSize: typography.sizes.xs,
    alignSelf: 'flex-end',
  },
  senderTime: {
    color: colors.neutral[100],
  },
  receiverTime: {
    color: colors.neutral[500],
  },
});