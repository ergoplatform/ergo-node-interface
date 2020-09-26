import React, { useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import usePortal from 'hooks/usePortal';
import useBodyScroll from 'hooks/useBodyScroll';
import useCurrentState from 'hooks/useCurrentState';
import { observer } from 'mobx-react-lite';
import Text from 'components/common/Text/Text';
import { Button } from 'components/common/Button/Button';
import Backdrop from '../Backdrop/Backdrop';
import { ModalConfig, ModalContext } from './modal-context';
import CssTransition from '../CssTransition/CssTransition';
import { CloseIcon } from '../icons/CloseIcon';

interface Props {
  title?: React.ReactNode;
  description?: React.ReactNode;
  primaryButtonContent: React.ReactNode;
  secondaryButtonContent: React.ReactNode;
  disableBackdropClick?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  onPrimaryHandler?: () => void;
  onSecondaryHandler?: () => void;
  open?: boolean;
  width?: string;
  wrapClassName?: string;
}

const defaultProps = {
  width: '26rem',
  wrapClassName: '',
  disableBackdropClick: false,
};

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export type ModalProps = Props & typeof defaultProps & NativeAttrs;

const InfoModal: React.FC<React.PropsWithChildren<ModalProps>> = ({
  title,
  description,
  primaryButtonContent,
  secondaryButtonContent,
  disableBackdropClick,
  onClose,
  onOpen,
  onPrimaryHandler,
  onSecondaryHandler,
  open,
}) => {
  const portal = usePortal('modal');
  const [, setBodyHidden] = useBodyScroll(null, { scrollLayer: true });
  const [visible, setVisible, visibleRef] = useCurrentState<boolean>(false);

  const closeModal = useCallback(() => {
    if (onClose) {
      onClose();
    }
    setVisible(false);
    setBodyHidden(false);
  }, [onClose, setVisible, setBodyHidden]);

  useEffect(() => {
    if (open === undefined) return;
    if (open && onOpen) {
      onOpen();
    }
    if (!open && visibleRef.current && onClose) {
      onClose();
    }

    setVisible(open);
    setBodyHidden(open);
  }, [onClose, onOpen, open, setBodyHidden, setVisible, visibleRef]);

  const closeFromBackdrop = () => {
    if (disableBackdropClick) return;
    closeModal();
  };

  const primaryButtonClickHandler = () => {
    if (onPrimaryHandler) {
      onPrimaryHandler();
    }
    if (onClose) {
      onClose();
    }
  };

  const secondaryButtonClickHandler = () => {
    if (onSecondaryHandler) {
      onSecondaryHandler();
    }
    if (onClose) {
      onClose();
    }
  };

  const modalConfig: ModalConfig = useMemo(
    () => ({
      close: closeModal,
    }),
    [closeModal]
  );

  if (!portal) return null;

  return createPortal(
    <ModalContext.Provider value={modalConfig}>
      <Backdrop
        onClick={closeFromBackdrop}
        visible={visible}
        className="info-modal-backdrop"
      >
        <CssTransition name="wrapper" visible={visible} clearTime={300}>
          <div className="info-modal">
            <div className="info-modal__content">
              <Text
                xl="subtitle2"
                color="black"
                className="mb-16 mb-md-32 pr-40 pr-md-0"
              >
                {title}
              </Text>
              <Text
                xl="body-text1"
                sm="small-text1"
                className="mb-40 mb-md-56 pr-40 pr-md-0"
              >
                {description}
              </Text>
              <Button
                variant="primary"
                size="m"
                className="info-modal__button--primary"
                onClick={primaryButtonClickHandler}
              >
                {primaryButtonContent}
              </Button>
              <Button
                variant="flat"
                size="l"
                className="info-modal__button--secondary"
                onClick={secondaryButtonClickHandler}
              >
                {secondaryButtonContent}
              </Button>
            </div>
            <button
              type="button"
              className="info-modal__button--close"
              onClick={closeModal}
            >
              <CloseIcon />
            </button>

            <style jsx>{`
              .wrapper-enter {
                opacity: 0;
                transform: translate3d(0px, -40px, 0px);
              }
              .wrapper-enter-active {
                opacity: 1;
                transform: translate3d(0px, 0px, 0px);
              }
              .wrapper-leave {
                opacity: 1;
                transform: translate3d(0px, 0px, 0px);
              }
              .wrapper-leave-active {
                opacity: 0;
                transform: translate3d(0px, -50px, 0px);
              }
              .info-modal-backdrop {
                width: 100px;
              }
            `}</style>
          </div>
        </CssTransition>
      </Backdrop>
    </ModalContext.Provider>,
    portal
  );
};

type ModalComponent<P = {}> = React.FC<P>;
type ComponentProps = Partial<typeof defaultProps> &
  Omit<Props, keyof typeof defaultProps> &
  NativeAttrs;

InfoModal.defaultProps = defaultProps;

export default InfoModal as ModalComponent<ComponentProps>;
