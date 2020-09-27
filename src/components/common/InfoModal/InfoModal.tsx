import React, { useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import usePortal from 'hooks/usePortal';
import useBodyScroll from 'hooks/useBodyScroll';
import useCurrentState from 'hooks/useCurrentState';
import Text from 'components/common/Text/Text';
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
  }, [open]);

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
              <h3 className="mb-3">{title}</h3>
              <Text
                xl="body-text1"
                sm="small-text1"
                className="mb-40 mb-md-56 pr-40 pr-md-0"
              >
                {description}
              </Text>
              <button
                type="button"
                className="btn btn-primary px-4"
                onClick={primaryButtonClickHandler}
              >
                {primaryButtonContent}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary px-4 ml-3"
                onClick={secondaryButtonClickHandler}
              >
                {secondaryButtonContent}
              </button>
            </div>
            <button
              type="button"
              className="info-modal__button--close"
              onClick={closeModal}
            >
              <CloseIcon />
            </button>

            <style>{`
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
