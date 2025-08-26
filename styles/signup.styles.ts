import { colors, spacing } from "@/utils/theme";
import { StyleSheet } from "react-native";

export const useSignupStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },
  header: {
    padding: spacing.xl,
    paddingTop: spacing.xxl + spacing.s,
  },
  backButton: {
    marginBottom: spacing.l,
    display:'flex',
    flexDirection: 'row',
    alignItems:'center'
  },
  title: {
    marginBottom: spacing.s,
  },
  subtitle: {
    marginBottom: spacing.m,
  },
  formContainer: {
    padding: spacing.xl,
  },
  errorContainer: {
    backgroundColor: colors.error[50],
    padding: spacing.m,
    borderRadius: 8,
    marginBottom: spacing.m,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xl,
  },
  loginButton: {
    marginBottom: spacing.m,
  },
  demoButton: {
    marginBottom: spacing.xl,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
