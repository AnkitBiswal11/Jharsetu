import { SmsIvrsGatewayModal } from "./sms-ivrs-gateway-modal";

interface NotificationDrawerProps {
  isOpen?: boolean;
  open?: boolean;
  onClose: () => void;
  trackingId?: string;
}

export function NotificationDrawer(props: NotificationDrawerProps) {
  const isModalOpen = Boolean(props.isOpen ?? props.open);

  return (
    <SmsIvrsGatewayModal
      isOpen={isModalOpen}
      onClose={props.onClose}
    />
  );
}

export default NotificationDrawer;