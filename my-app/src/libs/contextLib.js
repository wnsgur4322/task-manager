import { useContext, createContext } from "react";

export const AppContext = createContext(null);
export const FailedMessageContext = createContext(null);
export const PermissionLevelContext = createContext(null);
export const SetInviteOpenContext = createContext(null);
export const SetRevokeOpenContext = createContext(null);
export const LogoutErrorContext = createContext(null);
export const isOwnerOfOrganizationContext = createContext(null);
export const SetEmailListOpenContext = createContext(null);

export function useAppContext() {
  return useContext(AppContext);
}

export function useFailedMessageContext() {
  return useContext(FailedMessageContext);
}

export function usePermissionLevelContext() {
  return useContext(PermissionLevelContext);
}

export function useSetInviteOpenContext() {
  return useContext(SetInviteOpenContext);
}

export function useSetRevokeOpenContext() {
  return useContext(SetRevokeOpenContext);
}

export function useLogoutErrorContext() {
  return useContext(LogoutErrorContext);
}

export function useIsOwnerOfOrganizationContext() {
  return useContext(isOwnerOfOrganizationContext);
}

export function useSetEmailListOpenContext() {
  return useContext(SetEmailListOpenContext);
}


// Magicform components
export const nameFieldOnContext = createContext(null);
export const emailFieldOnContext = createContext(null);
export const roleOptionOnContext = createContext(null);
export const startFieldOnContext = createContext(null);
export const endFieldOnContext = createContext(null);
export const commentsOnContext = createContext(null);
export const subCheckOnContext = createContext(null);
export const dateContext = createContext(null);
export const endDateContext = createContext(null);
export const formContext = createContext(null);

export function useNameFieldOnContext() {
  return useContext(nameFieldOnContext);
}

export function useEmailFieldOnContext() {
  return useContext(emailFieldOnContext);
}

export function useRoleOptionOnContext() {
  return useContext(roleOptionOnContext);
}

export function useStartFieldOnContext() {
  return useContext(startFieldOnContext);
}

export function useEndFieldOnContext() {
  return useContext(endFieldOnContext);
}

export function useCommentsOnContext() {
  return useContext(commentsOnContext);
}

export function useSubCheckOnContext() {
  return useContext(subCheckOnContext);
}

export function useDateContext() {
  return useContext(dateContext);
}

export function useEndDateContext() {
  return useContext(endDateContext);
}

export function useFormContext() {
  return useContext(formContext);
}