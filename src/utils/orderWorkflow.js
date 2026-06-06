export const isDeliveryComplete = (d) => !!(d?.deliveryDate && d?.handoverTo);

export const isInvoiceComplete = (i) => !!(i?.invoiceNumber && i?.invoiceDate);

export const getInstallableItems = (order) =>
  (order?.items || []).filter(
    (item) => item.itemType !== 'service' && !!item.requiresInstallation
  );

export const hasInstallableItems = (order) => getInstallableItems(order).length > 0;

export const getItemInstallationStatus = (order, boqItemId) => {
  const entry = (order?.installation?.boqInstallation || []).find(
    (b) => b.boqItemId === boqItemId
  );
  return entry?.status || 'Pending';
};

export const getPendingInstallationCount = (order) =>
  getInstallableItems(order).filter(
    (item) => getItemInstallationStatus(order, item.id) !== 'Installed'
  ).length;

export const isAllInstallationComplete = (order) => {
  const installable = getInstallableItems(order);
  if (installable.length === 0) return true;
  return installable.every(
    (item) => getItemInstallationStatus(order, item.id) === 'Installed'
  );
};

export const isInstallationPending = (order) =>
  order?.currentStage === 'service' && !isAllInstallationComplete(order);

/** Resolve next stage after delivery — skip service when no installable items */
export const getStageAfterDelivery = (order) =>
  hasInstallableItems(order) ? 'service' : 'completed';
