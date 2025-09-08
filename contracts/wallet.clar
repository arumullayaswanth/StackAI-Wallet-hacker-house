(define-trait ft-like (
  (transfer (uint principal principal) (response bool uint))
))


;; Simple wallet contract for STX with lock/unlock and transfer, plus a generic
;; trait-based interface for fungible token interactions when integrated.

(define-constant ERR_UNAUTHORIZED u100)
(define-constant ERR_INSUFFICIENT_BALANCE u101)
(define-constant ERR_LOCKED u102)
(define-constant ERR_LIMIT_EXCEEDED u103)

;; Safety rule: max single-transfer ratio in basis points (e.g., 2000 = 20%)
(define-data-var max-transfer-bps uint u2000)

;; Per-user locked balances (STX) and free balances tracked virtually for rules.
;; Note: STX is native; we track locks to enforce safety. Actual STX held by caller.
(define-map locked-stx
  { owner: principal }
  { amount: uint }
)

(define-read-only (get-locked (owner principal))
  (default-to u0 (get amount (map-get? locked-stx { owner: owner })))
)

(define-public (set-max-transfer-bps (bps uint))
  (begin
    (ok (var-set max-transfer-bps bps))
  )
)

(define-read-only (get-max-transfer-bps)
  (var-get max-transfer-bps)
)

;; Helper to check safety rule: amount <= balance * bps / 10000
(define-private (within-limit (balance uint) (amount uint))
  (<= amount (/ (* balance (var-get max-transfer-bps)) u10000))
)

;; Locks caller funds virtually for investment purposes
(define-public (lock-funds (amount uint) (purpose (string-ascii 32)))
  (let
    (
      (current (get-locked tx-sender))
      (new (+ current amount))
    )
    (begin
      (map-set locked-stx { owner: tx-sender } { amount: new })
      (ok new)
    )
  )
)

(define-public (unlock-funds (amount uint))
  (let
    (
      (current (get-locked tx-sender))
    )
    (begin
      (asserts! (>= current amount) (err ERR_LOCKED))
      (map-set locked-stx { owner: tx-sender } { amount: (- current amount) })
      (ok (- current amount))
    )
  )
)

;; Transfer STX with safety check against virtual balance rule
(define-public (transfer-stx (amount uint) (recipient principal))
  (let
    (
      (balance (stx-get-balance tx-sender))
      (locked (get-locked tx-sender))
      (spendable (if (> balance locked) (- balance locked) u0))
    )
    (begin
      (asserts! (> spendable u0) (err ERR_INSUFFICIENT_BALANCE))
      (asserts! (within-limit spendable amount) (err ERR_LIMIT_EXCEEDED))
      (stx-transfer? amount tx-sender recipient)
    )
  )
)

;; Generic fungible-token transfer via trait reference
(define-public (transfer-token (token <ft-like>) (amount uint) (recipient principal))
  (let
    (
      (res (contract-call? token transfer amount tx-sender recipient))
    )
    res
  )
)

;; Read-only helpers
(define-read-only (balance-of (who principal))
  (stx-get-balance who)
)


