<template>
    <div>
        <header class="form-header">
            <router-link
                    class="form-header__back"
                    :to="prevPage"
            >
                &#8678;
            </router-link>
            <h1 class="form-header__title">
                SendToSign
            </h1>
        </header>
        <div class="form">
            <h2 class="form__title">
                {{ this.$route.params.l2f_id ? "Edit SendToSign" : `Create new SendToSign for ${currentDocumentName}.${currentDocumentType} document`}}
            </h2>

            <form-section
                    title="SendToSign method"
            >
                <switcher-radio
                        slot="form-control"
                        v-model="formData.method"
                        :inputs="[{value: 'sendtoeach', title: 'SendToEach'}, {value: 'sendtogroup', title: 'SendToGroup'}]"
                        radio-name="method"
                />
            </form-section>

            <div v-if="formData.method === 'sendtogroup'" key="sendtogroup-fields">
                <form-section
                        title="Enter Your Envelope Name"
                >
                    <input type="text"
                           slot="form-control"
                           class="input"
                           :class="{'input_invalid': formErrors.envelope_name}"
                           @input="resetFormError('envelope_name')"
                           v-model="formData.envelope_name"
                           maxlength="255"
                    >
                </form-section>

                <form-section
                        title="Sign In Order"
                >
                    <switcher-component
                            slot="form-control"
                            v-model="formData.sign_in_order"
                    />
                </form-section>
            </div>

            <div v-if="formData.method === 'sendtoeach'" key="sendtoeach-fields">
                <form-section
                        title="Authenticate Signer"
                >
                    <switcher-radio
                            slot="form-control"
                            v-model="formData.security_pin"
                            :inputs="[{value: 'standard', title: 'Standard'}, {value: 'enhanced', title: 'Enhanced'}]"
                            radio-name="security_pin"
                    />
                </form-section>

                <form-section
                        v-if="formData.security_pin === 'enhanced'"
                        title="Authenticate pin"
                        key="pin"
                >
                    <input type="text"
                           slot="form-control"
                           class="input"
                           :class="{'input_invalid': formErrors.pin}"
                           @input="resetFormError('pin')"
                           v-model="formData.pin"
                    >
                </form-section>
            </div>

            <form-section
                    title="Send notifications"
            >
                <switcher-component
                        slot="form-control"
                        v-model="formData.sender_notifications"
                />
            </form-section>

            <div class="recipients">
                <div class="recipient" v-for="(recipient, recipientIndex) in formData.recipients" :key="recipientIndex">
                    <div class="recipient__edit">
                        <div class="recipient__edit-action recipient__edit-action_first">
                            <input type="text"
                                   class="input recipient__edit-input-order"
                                   v-if="formData.sign_in_order && formData.method === 'sendtogroup'"
                                   key="order"
                                   :class="{'input_invalid': recipient.errors.order}"
                                   @input="resetRecipientFormError('order', recipientIndex)"
                                   v-model.number="recipient.order"
                                   maxlength="2"
                            >
                            <input type="text"
                                   class="input"
                                   v-model="recipient.name"
                                   :class="{'input_invalid': recipient.errors.name}"
                                   @input="resetRecipientFormError('name', recipientIndex)"
                                   placeholder="Recipient Name"
                            >
                        </div>
                        <div class="recipient__edit-action">
                            <input type="text"
                                   class="input"
                                   v-model="recipient.email"
                                   :class="{'input_invalid': recipient.errors.email}"
                                   @input="resetRecipientFormError('email', recipientIndex)"
                                   placeholder="Recipient Email"
                            >
                        </div>
                        <div class="recipient__edit-action recipient__edit-action_delete">
                            <button class="button button_secondary"
                                    :disabled="formData.recipients.length === 1"
                                    @click="deleteRecipient(recipientIndex)"
                            >
                                Delete
                            </button>
                        </div>
                        <div class="recipient__edit-action recipient__edit-action_toggle"
                             :class="{ 'is-open': !recipient.isCollapsed}"
                             @click="toggleRecipientSection(recipientIndex)"
                        >
                            Options
                        </div>
                    </div>

                    <div v-if="!recipient.isCollapsed" :key="`full-info-${recipientIndex}`">
                        <form-section title="Require Photo">
                            <switcher-component
                                    slot="form-control"
                                    v-model="recipient.require_photo"
                            />
                        </form-section>

                        <form-section title="Request additional documents">
                            <tags-component
                                    slot="form-control"
                                    :tags-list="recipient.additional_documents"
                                    :has-error="recipient.errors.additional_documents"
                                    :max-items="5"
                                    placeholder="Add new document"
                                    @add-tag-item="addAdditionalDocument($event, recipientIndex)"
                                    @remove-tag-item="removeAdditionalDocument($event, recipientIndex)"
                                    @reset-tag-input-error="resetRecipientFormError('additional_documents', recipientIndex)"
                            />
                        </form-section>

                        <form-section title="Phone Authenticate Number"
                                      v-if="formData.method === 'sendtoeach' && formData.security_pin === 'enhanced'"
                                      key="phone-auth"
                        >
                            <input type="text"
                                   slot="form-control"
                                   class="input"
                                   v-model="recipient.phone_authenticate"
                            >
                        </form-section>

                        <form-section title="Editing Permissions">
                            <switcher-radio
                                    slot="form-control"
                                    v-model="recipient.access"
                                    :inputs="[{value: 'signature', title: 'Signature Only'}, {value: 'full', title: 'Full Access'}]"
                                    radio-name="access"
                            />
                        </form-section>

                        <form-section title="Message">
                            <div slot="form-control">
                                <div class="form-section-message__subject">Subject:</div>
                                <input type="text"
                                       class="input form-section-message__subject-input"
                                       v-model="recipient.message_subject"
                                       maxlength="255"
                                >
                                <textarea type="text"
                                          class="input input_textarea form-section-message__text"
                                          v-model="recipient.message_text"
                                          placeholder="Message"
                                          maxlength="500"
                                ></textarea>
                            </div>
                        </form-section>
                    </div>
                </div>
                <div>
                    <button
                            @click="addRecipient"
                            class="button button_add"
                            :disabled="formData.recipients.length >= 20"
                    >
                        Add Another Recipient
                    </button>
                </div>
            </div>

            <button class="button button_primary form-button"
                    @click="submitS2SForm"
            >
                Create SendToSign
            </button>
        </div>
        <modal-component
                :show-modal="showResultModal"
                modal-type="alert"
                modal-title="SendToSign Created"
                @modal-close="closeResultModal"
                @modal-ok="closeResultModal"
        >
            <div class="modal-body text-center" slot="modal-body">
                We Have Sent Your Document to Be Signed!
            </div>
        </modal-component>
    </div>
</template>

<script src="./SendToSignForm.js"></script>