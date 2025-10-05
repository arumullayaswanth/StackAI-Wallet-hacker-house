(define-trait staking-pool (
  (stake (uint principal) (response uint uint))
  (unstake (uint principal) (response uint uint))
  (claim (principal) (response uint uint))
))

;; Simplified DeFi interface for demo/testing. Records stakes and allows returns.

(define-constant ERR_NOT_ENOUGH u200)
(define-constant ERR_NO_STAKE u201)

(define-map stakes
  { user: principal, pool: uint }
  { amount: uint }
)

(define-read-only (get-stake (user principal) (pool-id uint))
  (default-to u0 (get amount (map-get? stakes { user: user, pool: pool-id })))
)

(define-public (stake (amount uint) (pool-id uint))
  (let
    (
      (current (get-stake tx-sender pool-id))
    )
    (begin
      (asserts! (> amount u0) (err ERR_NOT_ENOUGH))
      (map-set stakes { user: tx-sender, pool: pool-id } { amount: (+ current amount) })
      (ok (+ current amount))
    )
  )
)

(define-public (unstake (amount uint) (pool-id uint))
  (let
    (
      (current (get-stake tx-sender pool-id))
    )
    (begin
      (asserts! (>= current amount) (err ERR_NO_STAKE))
      (map-set stakes { user: tx-sender, pool: pool-id } { amount: (- current amount amount) })
      (ok (- current amount amount))
    )
  )
)

(define-public (claim (pool-id uint))
  (let
    (
      (current (get-stake tx-sender pool-id))
      (reward (/ current u10))
    )
    (ok reward)
  )
)



