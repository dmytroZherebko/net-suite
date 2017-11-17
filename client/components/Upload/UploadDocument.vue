<template>
    <div class="column-aside">
        <button class="button button_menu" @click="openModal">
            Upload
        </button>
        <modal-component
                :show-modal="showModal"
                :show-buttons="false"
                modal-title="Upload Document"
                modal-type="modal"
                modal-class="modal_uploader"
                @modal-close="closeModal"
        >
            <div slot="modal-body">
                <div class="uploader">
                    <ul class="upload-options">
                        <li
                            v-for="option in uploadOptions"
                            :key="option.type"
                            :class="checkOptionIsActive(option.type)"
                            class="upload-options__item"
                            @click="changeUploadOption(option.type)">
                            {{ option.title }}
                        </li>
                    </ul>
                    <div class="upload-section">
                        <div v-if="currentOption === 'file'">
                            <form
                                  novalidate
                                  @submit.prevent=""
                            >
                                <label class="upload-section__file"
                                       :class="checkOnDragBlock()"
                                       @dragenter.prevent="onDragEnter"
                                       @dragleave="onDragLeave"
                                       @drop.prevent="onDrop"
                                       @dragover.prevent=""
                                >
                                    <h3 class="upload-section__title">
                                        Drag and Drop Document Here to Get Started!
                                    </h3>
                                    <p class="upload-section__description">
                                        Use the button below to upload your document to PDFfiller.
                                        PDFfiller supports PDF, Word, PowerPoint, and Text formats.
                                    </p>
                                    <input
                                            type="file"
                                            accept=".ppt, .pptx, .doc, .docx, .pdf"
                                            class="upload-section__input-file"
                                            @change="onChooseFile"
                                    >
                                    <div class="button button_primary upload-section__upload-button">
                                        Browse for a Document on Your Computer
                                    </div>
                                </label>
                            </form>
                        </div>
                        <div v-if="currentOption === 'url'">
                            <form
                                    novalidate
                                    @submit.prevent="onUrlUploadSubmit"
                            >
                                <h3 class="upload-section__title">
                                    Add Documents from the Web
                                </h3>
                                <p class="upload-section__description">
                                    Enter the URL of a document hosted online to add it to PDFfiller.
                                </p>
                                <p class="upload-section__description">
                                    PDFfiller supports PDF, Word, and PowerPoint files. Max file size: 25 Mb!
                                </p>
                                <div class="upload-section__input-wrapper">
                                    <input
                                            type="text"
                                            class="input"
                                            :class="checkUrlError()"
                                            placeholder="http://"
                                            v-model.trim="uploadFileUrl.value"
                                            @input="onChangeUrlValue"
                                    >
                                    <button class="button button_primary upload-section__button">
                                        Upload
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </modal-component>
        <modal-component
                :show-modal="showSuccessUploadModal"
                modal-title="Successful upload"
                modal-type="alert"
                @modal-close="closeSuccessModal"
                @modal-ok="closeSuccessModal"
        >
            <div class="modal-body text-center" slot="modal-body">
                File was successfully uploaded.
            </div>
        </modal-component>
    </div>
</template>

<script src="./UploadDocument.js"></script>